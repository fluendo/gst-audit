#!/usr/bin/env python3
"""
Pytest configuration and fixtures for GIRest E2E tests.

These fixtures manage the lifecycle of:
- GStreamer pipeline process (gst-launch)
- GIRest server process (girest-frida.py)
- Mock callback server (for non-SSE tests)
"""

import asyncio
import os
import signal
import subprocess
import sys
import tempfile
import threading
import time

import httpx
import pytest
from aiohttp import web

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))


# ============================================================================
# Helper Functions
# ============================================================================


def get_active_correlation_id():
    """
    Get the active correlation ID for the current thread.
    This is used to automatically propagate correlation IDs in reentrant API calls.

    Returns:
        str or None: The correlation ID if in callback context, None otherwise
    """
    if not hasattr(threading, "_girest_correlation_id"):
        return None
    thread_id = threading.get_ident()
    return threading._girest_correlation_id.get(thread_id)


def set_active_correlation_id(correlation_id):
    """
    Set the active correlation ID for the current thread.

    Args:
        correlation_id: The correlation ID to set, or None to clear
    """
    if not hasattr(threading, "_girest_correlation_id"):
        threading._girest_correlation_id = {}

    thread_id = threading.get_ident()

    if correlation_id is None:
        # Clear correlation ID
        if thread_id in threading._girest_correlation_id:
            del threading._girest_correlation_id[thread_id]
    else:
        # Set correlation ID
        threading._girest_correlation_id[thread_id] = correlation_id


def inject_correlation_id_header(headers=None):
    """
    Inject X-Correlation-Id header if we're in a callback context.

    Args:
        headers: Existing headers dict (optional)

    Returns:
        dict: Headers with correlation ID added if applicable
    """
    if headers is None:
        headers = {}

    correlation_id = get_active_correlation_id()
    if correlation_id is not None:
        headers["X-Correlation-Id"] = str(correlation_id)

    return headers


def assert_api_success(response, msg="API call failed"):
    """
    Assert that API call succeeded with 2xx status code.

    Args:
        response: httpx.Response object
        msg: Optional error message

    Returns:
        dict: Parsed JSON response

    Raises:
        AssertionError: If status code is not 2xx
    """
    assert 200 <= response.status_code < 300, f"{msg}: {response.status_code}, response: {response.text}"
    return response.json()


def assert_has_ptr(obj, msg="Object should have ptr"):
    """
    Assert that object has a valid pointer field.

    Args:
        obj: Dictionary that should contain a 'ptr' field
        msg: Optional error message

    Returns:
        str: The pointer value

    Raises:
        AssertionError: If object doesn't have valid ptr
    """
    assert isinstance(obj, dict), f"{msg}: not a dict"
    assert "ptr" in obj, f"{msg}: missing ptr field"
    assert obj["ptr"] is not None, f"{msg}: ptr is None"
    return obj["ptr"]


def assert_callback_invocation(callback_data, expected_args=None):
    """
    Assert that callback data has the correct structure for non-SSE callback invocations.

    All non-SSE callbacks follow the same structure:
    - sessionId: Session identifier
    - callbackName: Name of the callback parameter
    - args: Dictionary containing the actual callback arguments (by parameter name)
    - invocationNumber: Sequential counter
    - timestamp: ISO 8601 timestamp

    Args:
        callback_data: The callback data received from the server
        expected_args: Optional list of expected argument names to verify

    Returns:
        dict: The args dictionary (the actual callback parameters)

    Raises:
        AssertionError: If callback structure is invalid
    """
    assert callback_data is not None, "Callback data is None"
    assert isinstance(callback_data, dict), f"Callback data should be dict, got {type(callback_data)}"

    # Verify metadata fields
    assert "sessionId" in callback_data, f"Missing 'sessionId' in callback: {callback_data}"
    assert "callbackName" in callback_data, f"Missing 'callbackName' in callback: {callback_data}"
    assert "args" in callback_data, f"Missing 'args' in callback: {callback_data}"
    assert "invocationNumber" in callback_data, f"Missing 'invocationNumber' in callback: {callback_data}"
    assert "timestamp" in callback_data, f"Missing 'timestamp' in callback: {callback_data}"

    # Verify args structure (now a dict, not a list)
    args = callback_data["args"]
    assert isinstance(args, dict), f"args should be a dict, got {type(args)}"

    # Optionally verify expected argument names
    if expected_args:
        for arg_name in expected_args:
            assert arg_name in args, f"Missing '{arg_name}' in callback args: {args}"

    return args


# ============================================================================
# Process Management Fixtures (Session-scoped)
# ============================================================================


@pytest.fixture(scope="session")
def gst_pipeline():
    """
    Start a GStreamer pipeline for E2E testing (session-scoped).

    Launches 'gst-launch-1.0 fakesrc ! fakesink' as a background process.
    The pipeline is shared across all E2E tests to avoid repeated
    startup/teardown overhead.

    The pipeline runs continuously with fakesrc producing buffers,
    which generates bus messages that can be used for callback testing.

    Yields:
        int: Process ID of the running pipeline
    """
    process = subprocess.Popen(
        ["gst-launch-1.0", "fakesrc", "is-live=true", "do-timestamp=true", "!", "fakesink", "sync=true"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # Give the pipeline time to start and enter PLAYING state
    time.sleep(3)

    # Verify it's running
    if process.poll() is not None:
        stdout, stderr = process.communicate()
        raise RuntimeError(
            f"GStreamer pipeline failed to start.\n" f"stdout: {stdout.decode()}\n" f"stderr: {stderr.decode()}"
        )

    print(f"\n✓ GStreamer pipeline started (PID: {process.pid})")

    yield process.pid

    # Cleanup: terminate the pipeline
    print(f"\n✓ Terminating GStreamer pipeline (PID: {process.pid})")
    try:
        process.send_signal(signal.SIGTERM)
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        print("⚠ Pipeline didn't terminate gracefully, killing it")
        process.kill()
        process.wait()


@pytest.fixture(scope="session")
def girest_server(gst_pipeline):
    """
    Start the GIRest server in non-SSE mode (session-scoped).

    Launches girest-frida.py attached to the GStreamer pipeline via Frida.
    This server is used for all basic tests and non-SSE callback tests.

    Args:
        gst_pipeline: PID of the running GStreamer pipeline

    Yields:
        str: Base URL of the running server (http://localhost:9000)
    """
    yield from _start_girest_server(gst_pipeline, sse_only=False, port=9000)


@pytest.fixture(scope="session")
def girest_server_sse(gst_pipeline):
    """
    Start the GIRest server in SSE-only mode (session-scoped).

    Launches girest-frida.py with --sse-only flag.
    This server is only used for SSE callback tests.

    Args:
        gst_pipeline: PID of the running GStreamer pipeline

    Yields:
        str: Base URL of the running server (http://localhost:9001)
    """
    yield from _start_girest_server(gst_pipeline, sse_only=True, port=9001)


def _start_girest_server(gst_pipeline, sse_only=False, port=9000):
    """
    Internal helper to start GIRest server with specified configuration.

    Args:
        gst_pipeline: PID of the running GStreamer pipeline
        sse_only: Whether to enable SSE-only mode
        port: Port number for the server

    Yields:
        str: Base URL of the running server
    """

    # Verify pipeline is still running
    try:
        os.kill(gst_pipeline, 0)
    except OSError:
        raise RuntimeError(f"Pipeline process {gst_pipeline} is not running")

    # Get path to girest-frida.py
    girest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "girest-frida.py")

    # Build command with sse_only flag if needed
    cmd = ["python3", "-u", girest_path, "Gst", "1.0", "--pid", str(gst_pipeline), "--port", str(port)]
    if sse_only:
        cmd.append("--sse-only")

    # Create log file for server output
    log_file = tempfile.NamedTemporaryFile(mode="w+", delete=False, suffix=".log", prefix="girest-server-")
    log_path = log_file.name
    print(f"✓ Server logs will be written to: {log_path}")

    # Start server with unbuffered output
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=1, universal_newlines=True
    )

    # Wait for server to be ready by monitoring stdout for the "Uvicorn running" message
    mode = "SSE-only" if sse_only else "non-SSE"
    print(f"\n✓ Starting GIRest server in {mode} mode (attaching to PID {gst_pipeline})...")

    ready = False
    startup_output = []
    timeout = 60  # Maximum time to wait for server startup
    start_time = time.time()

    while time.time() - start_time < timeout:
        # Check if process is still running
        if process.poll() is not None:
            # Process died, collect remaining output
            remaining = process.stdout.read()
            startup_output.append(remaining)
            log_file.write(remaining)
            log_file.close()
            raise RuntimeError(f"GIRest server process died during startup.\n" f"output:\n{''.join(startup_output)}")

        # Read one line from stdout
        line = process.stdout.readline()
        if line:
            startup_output.append(line)
            log_file.write(line)
            log_file.flush()
            # Check for the ready message
            if "Uvicorn running on" in line:
                ready = True
                print("✓ GIRest server ready (detected startup message)")
                break

    if not ready:
        process.send_signal(signal.SIGTERM)
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
        raise RuntimeError(
            f"GIRest server did not start within {timeout} seconds.\n" f"output:\n{''.join(startup_output)}"
        )

    base_url = f"http://localhost:{port}"

    # Start a background thread to capture server output during test
    def capture_output():
        try:
            for line in process.stdout:
                log_file.write(line)
                log_file.flush()
        except:
            pass

    output_thread = threading.Thread(target=capture_output, daemon=True)
    output_thread.start()

    yield base_url

    # Cleanup: terminate the server
    print("\n✓ Terminating GIRest server...")
    try:
        process.send_signal(signal.SIGTERM)
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        print("⚠ Server didn't terminate gracefully, killing it")
        process.kill()
        process.wait()

    # Wait for output thread to finish reading remaining output (with timeout)
    output_thread.join(timeout=2.0)

    # Close log file
    log_file.close()
    print(f"✓ Server logs saved to: {log_path}")


# ============================================================================
# Callback Server Fixture (Function-scoped for test isolation)
# ============================================================================


@pytest.fixture
async def callback_server():
    """
    Create a mock HTTP callback server for non-SSE callback tests.

    This server receives callback POSTs from girest and records them
    for test validation. Each test gets a fresh server instance with
    clean state.

    The server listens on localhost:8888 and accepts POSTs to any path.

    Yields:
        CallbackServerHelper: Helper object with methods:
            - url: str - Base URL of the callback server
            - callback_url(path=""): str - Full callback URL
            - set_callback_handler(callback_id, handler): - Set custom callback logic
            - wait_for_callback(callback_id, timeout=5): dict - Wait for specific callback
            - wait_for_callbacks(callback_id, expected_count, timeout): list - Wait for multiple callbacks
            - get_callbacks(): list - Get all received callbacks
            - clear() - Clear received callbacks list
    """
    received_callbacks = {}  # Dict[str, list] - callback_id -> list of received data
    callback_events = {}  # Dict[str, asyncio.Event] - callback_id -> event
    callback_handlers = {}  # Dict[str, callable] - callback_id -> custom handler function

    class CallbackServerHelper:
        def __init__(self, host, port):
            self.host = host
            self.port = port
            self.url = f"http://{host}:{port}"
            self.runner = None

        def callback_url(self, callback_id="default"):
            """Get full callback URL for a specific callback identifier."""
            return f"{self.url}/callback/{callback_id}"

        async def callback_handler(self, request):
            """Handle incoming callback POST requests."""
            # Extract callback_id from path (e.g., /callback/foreach_pad_test)
            path_parts = request.path.strip("/").split("/")
            callback_id = path_parts[-1] if len(path_parts) >= 2 else "default"

            # Parse callback data
            data = await request.json()

            # Extract correlation ID from callback data (sent by server for thread affinity)
            correlation_id = data.get("correlationId")

            # Store the callback data
            if callback_id not in received_callbacks:
                received_callbacks[callback_id] = []
            received_callbacks[callback_id].append(data)

            # Signal that this specific callback was received
            if callback_id in callback_events:
                callback_events[callback_id].set()

            # Check if there's a custom handler configured
            response_value = None
            if callback_id in callback_handlers:
                handler = callback_handlers[callback_id]

                # Call the custom handler in a thread pool to avoid blocking the event loop
                # This allows the HTTP server to handle reentrant requests from within callbacks
                # We need to set the correlation ID in the thread pool thread, not here
                import asyncio

                def handler_with_correlation_id():
                    # Set correlation ID for automatic propagation in reentrant calls
                    try:
                        set_active_correlation_id(correlation_id)
                        return handler(data)
                    finally:
                        # Clean up correlation ID
                        set_active_correlation_id(None)

                response_value = await asyncio.to_thread(handler_with_correlation_id)
            else:
                # Default response for sync callbacks: return True to continue iteration
                response_value = True

            # Return response matching the OpenAPI schema: {CallbackName}Return format
            # The schema has a "return" property for the return value
            return web.json_response({"return": response_value})

        async def start(self):
            """Start the callback server."""
            app = web.Application()
            # Add route that matches any callback path
            app.router.add_post("/callback/{callback_id}", self.callback_handler)

            self.runner = web.AppRunner(app)
            await self.runner.setup()
            site = web.TCPSite(self.runner, self.host, self.port)
            await site.start()
            print(f"✓ Callback server started at {self.url}")

        async def stop(self):
            """Stop the callback server."""
            if self.runner:
                await self.runner.cleanup()
                print("✓ Callback server stopped")

        def set_callback_handler(self, callback_id, handler):
            """
            Set a custom handler function for a specific callback.

            The handler will be called with the callback data and should return
            the value to send back in the HTTP response (for sync callbacks).

            Args:
                callback_id: Identifier for the callback
                handler: Callable that takes callback_data and returns a response value

            Example:
                def my_handler(callback_data):
                    args = callback_data["args"][0]
                    print(f"Received pad: {args['pad']}")
                    return True  # Continue iteration

                callback_server.set_callback_handler("test_id", my_handler)
            """
            callback_handlers[callback_id] = handler

        async def wait_for_callback(self, callback_id="default", timeout=5.0):
            """
            Wait for a specific callback to be received and return its data.

            Args:
                callback_id: Identifier for the callback to wait for
                timeout: Maximum time to wait in seconds

            Returns:
                dict: The callback data that was received, or None if timeout
            """
            # Check if callback has already arrived
            if callback_id in received_callbacks and received_callbacks[callback_id]:
                return received_callbacks[callback_id][0]

            # Create event if it doesn't exist
            if callback_id not in callback_events:
                callback_events[callback_id] = asyncio.Event()

            try:
                await asyncio.wait_for(callback_events[callback_id].wait(), timeout=timeout)
                # Return the first received callback for this ID
                callbacks = received_callbacks.get(callback_id, [])
                return callbacks[0] if callbacks else None
            except asyncio.TimeoutError:
                return None

        async def wait_for_callbacks(self, callback_id="default", expected_count=1, timeout=5.0):
            """
            Wait for a specific number of callbacks to be received.

            Useful for async callbacks that may arrive after the API call completes.
            For sync callbacks, this is usually not needed - just check get_callbacks() after the call.

            Args:
                callback_id: Identifier for the callback to wait for
                expected_count: Number of callbacks expected
                timeout: Maximum time to wait in seconds

            Returns:
                list: List of callback data received, or None if timeout/count mismatch
            """
            start_time = asyncio.get_event_loop().time()

            while asyncio.get_event_loop().time() - start_time < timeout:
                callbacks = received_callbacks.get(callback_id, [])
                if len(callbacks) >= expected_count:
                    return callbacks[:expected_count]

                # Wait a bit before checking again
                await asyncio.sleep(0.1)

            # Timeout - return None
            return None

        def get_callbacks(self, callback_id=None):
            """
            Get received callbacks.

            Args:
                callback_id: If provided, get only callbacks for this ID

            Returns:
                list or dict: List of callbacks for specific ID, or all callbacks dict
            """
            if callback_id:
                return received_callbacks.get(callback_id, [])
            return dict(received_callbacks)

        def get_last_callback(self, callback_id="default"):
            """Get the most recently received callback for a specific ID, or None."""
            callbacks = received_callbacks.get(callback_id, [])
            return callbacks[-1] if callbacks else None

        def clear(self):
            """Clear all received callbacks, events, and handlers."""
            received_callbacks.clear()
            callback_events.clear()
            callback_handlers.clear()

    # Create and start the helper
    helper = CallbackServerHelper("localhost", 8888)
    await helper.start()

    yield helper

    # Cleanup
    await helper.stop()


# ============================================================================
# GStreamer Element Factory Fixtures
# ============================================================================


@pytest.fixture
async def gst_bin_factory(girest_server):
    """
    Factory fixture for creating GstBin elements.

    Usage:
        bin_ptr = await gst_bin_factory("my_bin")

    Automatically unrefs all created bins on teardown.
    """
    created_bins = []

    async def create_bin(name=None):
        """Create a GstBin element and track it for cleanup."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            params = {"factoryname": "bin"}
            if name:
                params["name"] = name

            response = await client.get(f"{girest_server}/Gst/ElementFactory/make", params=params)
            assert_api_success(response, f"Failed to create bin '{name}'")
            bin_data = response.json()
            assert "return" in bin_data
            assert_has_ptr(bin_data["return"])
            bin_ptr = bin_data["return"]["ptr"]
            created_bins.append(bin_ptr)
            return bin_ptr

    yield create_bin

    # Cleanup: unref all created bins
    async with httpx.AsyncClient(timeout=30.0) as client:
        for bin_ptr in created_bins:
            try:
                await client.get(f"{girest_server}/Gst/Object/ptr,{bin_ptr}/unref")
            except Exception as e:
                print(f"Warning: Failed to unref bin {bin_ptr}: {e}")


@pytest.fixture
async def gst_identity_factory(girest_server):
    """
    Factory fixture for creating identity elements.

    Usage:
        identity_ptr = await gst_identity_factory("my_identity")

    Automatically unrefs all created identities on teardown.
    """
    created_identities = []

    async def create_identity(name=None):
        """Create an identity element and track it for cleanup."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            params = {"factoryname": "identity"}
            if name:
                params["name"] = name

            response = await client.get(f"{girest_server}/Gst/ElementFactory/make", params=params)
            assert_api_success(response, f"Failed to create identity '{name}'")
            identity_data = response.json()
            assert "return" in identity_data
            assert_has_ptr(identity_data["return"])
            identity_ptr = identity_data["return"]["ptr"]
            created_identities.append(identity_ptr)
            return identity_ptr

    yield create_identity

    # Cleanup: unref all created identities
    async with httpx.AsyncClient(timeout=30.0) as client:
        for identity_ptr in created_identities:
            try:
                await client.get(f"{girest_server}/Gst/Object/ptr,{identity_ptr}/unref")
            except Exception as e:
                print(f"Warning: Failed to unref identity {identity_ptr}: {e}")
