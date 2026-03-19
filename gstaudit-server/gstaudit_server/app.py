#!/usr/bin/env python3
import argparse
import ctypes
import logging
import os
import shlex
import subprocess
import threading
import time

from apispec import APISpec
from connexion.resolver import Resolver
from girest.app import GIApp
from girest.resolvers import FridaResolver
from starlette.middleware.cors import CORSMiddleware
from uvicorn.config import LOGGING_CONFIG
from uvicorn.logging import DefaultFormatter


def create_stub():
    """
    Fork a child process with GStreamer libraries pre-loaded.

    The child process will:
    1. Load the GStreamer libraries
    2. Keep running to allow Frida to attach

    Returns:
        PID of the child process (from parent), or does not return (from child)
    """
    # GStreamer libraries to load
    lib_paths = ["libgstreamer-1.0.so.0", "libgobject-2.0.so.0", "libglib-2.0.so.0"]

    pid = os.fork()

    if pid > 0:
        # PARENT: Return the PID to the caller
        return pid
    else:
        # 1. Map the libraries into memory
        for lib in lib_paths:
            try:
                ctypes.CDLL(lib)
            except OSError:
                # Silently continue if library fails to load
                pass

        # 2. Keep the process alive for Frida to attach
        # The process needs to be running (not stopped) for Frida to attach successfully
        while True:
            time.sleep(1)


class GstAuditResolver(Resolver):
    def resolve_function_from_operation_id(self, operation_id):
        async def get_pipelines(*args, **kwargs):
            """Endpoint for retrieving discovered GStreamer pipelines."""
            pipelines = _get_pipelines()
            return [p for p in pipelines if p["name"].isascii()]

        async def register_logs(body, **kwargs):
            """Endpoint for registering a log callback."""
            from connexion import request

            callback_url = body.get("url")
            if not callback_url:
                return {"error": "Missing 'url' parameter"}, 400

            # Get session-id and callback-secret from headers
            session_id = request.headers.get("session-id")
            callback_secret = request.headers.get("callback-secret")

            if not session_id:
                return {"error": "Missing 'session-id' header"}, 400

            try:
                callback_id = _add_log_callback(
                    {"url": callback_url, "session_id": session_id, "secret": callback_secret}
                )

                return {"success": True, "callbackId": callback_id}, 200
            except Exception as e:
                logger.error(f"Error registering log callback: {e}")
                return {"error": str(e)}, 500

        async def unregister_logs(body, **kwargs):
            """Endpoint for unregistering a log callback."""
            callback_id = body.get("callbackId")
            if not callback_id:
                return {"error": "Missing 'callbackId' parameter"}, 400

            try:
                removed = _remove_log_callback(callback_id)

                if removed:
                    return {"success": True, "message": "Callback unregistered successfully"}, 200
                else:
                    return {"error": "Callback ID not found"}, 404
            except Exception as e:
                logger.error(f"Error unregistering log callback: {e}")
                return {"error": str(e)}, 500

        # Route to the appropriate handler
        if operation_id == "get_pipelines":
            return get_pipelines
        elif operation_id == "register_logs":
            return register_logs
        elif operation_id == "unregister_logs":
            return unregister_logs

        return None


def _add_pipeline(pipeline_data: dict):
    """
    Add a pipeline to the list of discovered pipelines.

    This is thread-safe and can be called from any thread (e.g., Frida's message handler).

    Args:
        pipeline_data: Dictionary containing pipeline data (ptr, name, etc.)
    """
    with pipelines_lock:
        # Check if pipeline is already in the list (by ptr)
        ptr = pipeline_data.get("ptr")
        if ptr and not any(p.get("ptr") == ptr for p in pipelines):
            pipelines.append(pipeline_data)


def _get_pipelines() -> list:
    """
    Get the current list of discovered pipelines.

    Returns:
        List of pipeline dictionaries
    """
    with pipelines_lock:
        # Return a copy to avoid external modifications
        return list(pipelines)


def _add_log_callback(callback_data: dict) -> str:
    """
    Add a log callback to the list of registered callbacks.
    Returns the callback ID.

    Args:
        callback_data: Dictionary containing url, session_id, secret

    Returns:
        Unique callback ID
    """
    import uuid

    with log_callbacks_lock:
        callback_id = str(uuid.uuid4())
        callback_data["id"] = callback_id
        log_callbacks.append(callback_data)

        # Register with Frida if this is the first callback
        if len(log_callbacks) == 1:
            logger.info("First log callback registered, enabling GStreamer logging")
            try:
                # Access the custom script (script.js is loaded as scripts[1], after girest.js)
                result = resolver.scripts[1].exports_sync.register_log_function()
                logger.info(f"Frida log registration result: {result}")
            except Exception as e:
                logger.error(f"Failed to register log function with Frida: {e}")
                log_callbacks.remove(callback_data)
                raise

        return callback_id


def _remove_log_callback(callback_id: str) -> bool:
    """
    Remove a log callback by ID.
    Returns True if removed, False if not found.

    Args:
        callback_id: The callback ID to remove

    Returns:
        True if removed successfully
    """
    with log_callbacks_lock:
        for callback in log_callbacks:
            if callback.get("id") == callback_id:
                log_callbacks.remove(callback)

                # Unregister from Frida if this was the last callback
                if len(log_callbacks) == 0:
                    logger.info("Last log callback removed, disabling GStreamer logging")
                    try:
                        # Access the custom script (script.js is loaded as scripts[1], after girest.js)
                        result = resolver.scripts[1].exports_sync.unregister_log_function()
                        logger.info(f"Frida log unregistration result: {result}")
                    except Exception as e:
                        logger.error(f"Failed to unregister log function from Frida: {e}")

                return True
        return False


def _broadcast_log(log_data: dict):
    """
    Broadcast a log message to all registered callbacks asynchronously.

    Args:
        log_data: The log data to broadcast
    """
    import asyncio
    import hashlib
    import hmac
    import json
    from datetime import datetime, timezone

    import aiohttp

    def create_signature(payload: dict, secret: str, timestamp: str) -> str:
        """Create HMAC-SHA256 signature for callback authentication"""
        if not secret:
            return ""

        secret_bytes = secret.encode() if isinstance(secret, str) else secret
        canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        message = f"{timestamp}.{canonical_json}"
        signature = hmac.new(secret_bytes, message.encode("utf-8"), hashlib.sha256).hexdigest()
        return signature

    async def post_to_callback(callback):
        """Post log data to a single callback"""
        try:
            payload = {
                "sessionId": callback["session_id"],
                "callbackName": "log",
                "args": log_data,
                "timestamp": log_data.get("timestamp"),
            }

            # Create headers with HMAC signature if secret is provided
            timestamp = datetime.now(timezone.utc).isoformat()
            headers = {
                "Content-Type": "application/json",
                "X-Callback-Timestamp": timestamp,
            }

            if callback.get("secret"):
                signature = create_signature(payload, callback["secret"], timestamp)
                headers["X-Callback-Signature"] = signature

            async with aiohttp.ClientSession() as session:
                # Use 30 second timeout to allow for Next.js compilation on first request.
                # The API routes import the generated GStreamer bindings which can take 10-15s
                # to compile on first load. Subsequent requests are fast (cached).
                async with session.post(
                    callback["url"], json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status != 200:
                        logger.warning(f"Log callback returned status {response.status}")
        except Exception as e:
            logger.debug(f"Error posting log to callback: {e}")

    async def broadcast():
        """Post to all callbacks concurrently"""
        with log_callbacks_lock:
            callbacks = list(log_callbacks)  # Copy to avoid lock during HTTP calls

        if callbacks:
            tasks = [post_to_callback(cb) for cb in callbacks]
            await asyncio.gather(*tasks, return_exceptions=True)

    # Run async broadcast in background thread
    def run_async():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(broadcast())
        loop.close()

    import threading

    thread = threading.Thread(target=run_async, daemon=True)
    thread.start()


def _on_log(level, message):
    """Handle the console from js"""
    levels = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
    }
    logger.log(levels[level], message)


def _on_message(message, data):
    """Handle messages from the Frida script"""
    if message["type"] != "send":
        return
    payload = message.get("payload", {})
    kind = payload.get("kind")

    # Handle log messages
    if kind == "log":
        log_data = payload.get("data")
        if log_data:
            _broadcast_log(log_data)
        return

    # Handle pipeline discovery messages
    if kind == "pipeline":
        _add_pipeline(payload["data"])
    else:
        # For now, just log other messages
        logger.debug(f"Message from Frida: {message}")


# Parsing of arguments
parser = argparse.ArgumentParser(description="GstAudit server - Instrument and audit GStreamer pipelines")

# Common arguments shared by all subcommands
parser.add_argument("--host", type=str, default="localhost", help="Host to bind the server to (default: localhost)")
parser.add_argument("--port", type=int, default=9000, help="Port to run the server on (default: 9000)")

# Create subparsers for the three modes
subparsers = parser.add_subparsers(dest="mode", required=True, help="Operation mode")

# 1. Connect mode - attach to an existing process
connect_parser = subparsers.add_parser("connect", help="Connect to an existing GStreamer process by PID")
connect_parser.add_argument("pid", type=int, help="Process ID to instrument")

# 2. Create mode - create a new empty process (for manual pipeline creation)
create_parser = subparsers.add_parser(
    "create", help="Create a new GStreamer process (for manual pipeline creation via API)"
)

# 3. Launch mode - launch a pipeline using gst-launch syntax
launch_parser = subparsers.add_parser("launch", help="Launch a GStreamer pipeline using gst-launch-1.0 syntax")
launch_parser.add_argument("pipeline", type=str, help="GStreamer pipeline description (gst-launch-1.0 syntax)")

args = parser.parse_args()

# Setup the log
logger = logging.getLogger("gstaudit")
# Use the same logger Uvicorn uses
handler = logging.StreamHandler()
handler.setFormatter(DefaultFormatter(fmt=LOGGING_CONFIG["formatters"]["default"]["fmt"]))
logger = logging.getLogger("gstaudit")
logger.handlers = []  # Remove any existing handlers
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

# Pipeline tracking
pipelines = []  # List of discovered pipelines
pipelines_lock = threading.Lock()

# Log callback tracking
log_callbacks = []  # List of registered log callbacks {id, url, session_id, secret}
log_callbacks_lock = threading.Lock()

# Process the mode and get the PID
pid = None
spawned_process = None

if args.mode == "connect":
    # Mode 1: Connect to existing process
    pid = args.pid
    logger.info(f"Connecting to existing process with PID: {pid}")

elif args.mode == "create":
    # Mode 2: Create a new empty process with GStreamer pre-loaded
    # Fork a child process with GStreamer libraries loaded
    pid = create_stub()
    logger.info(f"Created new GStreamer process with PID: {pid}")

elif args.mode == "launch":
    # Mode 3: Launch a pipeline from command line
    command = shlex.split(f"gst-launch-1.0 {args.pipeline}")
    spawned_process = subprocess.Popen(command)
    pid = spawned_process.pid
    logger.info(f"Launched pipeline '{args.pipeline}' with PID: {pid}")

# Create the resolver with Frida
script_path = os.path.join((os.path.dirname(__file__)), "script.js")
resolver = FridaResolver("GstVideo", "1.0", pid, scripts=[script_path], on_message=_on_message, on_log=_on_log)

# Create the girest GIApp
app = GIApp(__name__, "GstVideo", "1.0", resolver, default_base_path="/girest")

# Add CORS middleware before exception handling to ensure it handles OPTIONS requests
from connexion.middleware import MiddlewarePosition  # noqa: E402

app.add_middleware(
    CORSMiddleware,
    position=MiddlewarePosition.BEFORE_EXCEPTION,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create our own API for fetching the pipelines
gstaudit_spec = APISpec(
    title="GstAudit REST API",
    version="0.1",
    openapi_version="3.0.2",
)

# Pipelines endpoint
pipelines_operation = {
    "summary": "Get GStreamer pipelines",
    "description": "Get the GstPipelines available in the process",
    "operationId": "get_pipelines",
    "tags": ["GstAudit"],
    "parameters": [],
    "responses": {
        "200": {
            "description": "List of GStreamer pipelines",
            "content": {"application/json": {"schema": {"type": "array", "items": {"type": "object"}}}},
        }
    },
}

# Log registration endpoint
register_logs_operation = {
    "summary": "Register log callback",
    "description": "Register a callback URL to receive GStreamer log messages",
    "operationId": "register_logs",
    "tags": ["GstAudit"],
    "parameters": [
        {
            "name": "session-id",
            "in": "header",
            "required": True,
            "schema": {"type": "string"},
            "description": "Session identifier for routing",
        },
        {
            "name": "callback-secret",
            "in": "header",
            "required": False,
            "schema": {"type": "string"},
            "description": "Shared secret for HMAC authentication",
        },
    ],
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {"url": {"type": "string", "description": "Callback URL to POST log messages to"}},
                    "required": ["url"],
                }
            }
        },
    },
    "responses": {
        "200": {
            "description": "Registration successful",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {"success": {"type": "boolean"}, "callbackId": {"type": "string"}},
                    }
                }
            },
        },
        "400": {"description": "Invalid request"},
        "500": {"description": "Server error"},
    },
}

# Log unregistration endpoint
unregister_logs_operation = {
    "summary": "Unregister log callback",
    "description": "Unregister a previously registered log callback",
    "operationId": "unregister_logs",
    "tags": ["GstAudit"],
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {"callbackId": {"type": "string", "description": "The callback ID to unregister"}},
                    "required": ["callbackId"],
                }
            }
        },
    },
    "responses": {
        "200": {
            "description": "Unregistration successful",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {"success": {"type": "boolean"}, "message": {"type": "string"}},
                    }
                }
            },
        },
        "404": {"description": "Callback ID not found"},
        "500": {"description": "Server error"},
    },
}

gstaudit_spec.path(path="/GstAudit/pipelines", operations={"get": pipelines_operation})
gstaudit_spec.path(path="/GstAudit/logs/register", operations={"post": register_logs_operation})
gstaudit_spec.path(path="/GstAudit/logs/unregister", operations={"post": unregister_logs_operation})

app.add_api(gstaudit_spec.to_dict(), resolver=GstAuditResolver(), base_path="/gstaudit")

# Run the server
app.run(port=args.port)
