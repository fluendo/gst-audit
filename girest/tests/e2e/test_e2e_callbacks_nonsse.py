#!/usr/bin/env python3
"""
End-to-end tests for non-SSE callback handling in GIRest.

These tests verify URL-based callbacks by:
1. Starting a mock HTTP server to receive callback POSTs
2. Calling GStreamer methods that take callback parameters
3. Providing the mock server URL as the callback parameter
4. Verifying the server receives POST requests with correct callback data
5. Testing different callback scopes (call/sync, async, notified, forever)

Non-SSE callbacks work by:
- Client provides a callback URL in the method call
- GIRest POSTs callback data to that URL (with HMAC signature)
- For sync callbacks (scope=call): waits for response
- For async callbacks: fire-and-forget
"""

import asyncio

import httpx
import pytest
from conftest import assert_api_success, assert_callback_invocation, assert_has_ptr


@pytest.mark.asyncio
async def test_call_scope_continues_on_true(girest_server, callback_server, gst_identity_factory):
    """
    Test that call-scope callbacks continue iteration when returning True.

    This test uses an identity element which has 2 pads (sink and src).
    When the callback returns True, both pads should be visited.
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Create an identity element (has sink and src pads)
        identity_ptr = await gst_identity_factory("test_identity")

        # Step 2: Set up callback handler that returns True (continue iteration)
        received_pads = []

        def my_callback_handler(callback_data):
            """Custom handler that tracks pads and returns True to continue."""
            args = assert_callback_invocation(callback_data, expected_args=["element", "pad", "user_data"])
            received_pads.append(args["pad"]["ptr"])
            return True  # Continue iteration

        callback_server.set_callback_handler("foreach_pad_test", my_callback_handler)

        # Step 3: Call foreach_pad with our callback URL
        callback_url = callback_server.callback_url("foreach_pad_test")

        response = await client.get(
            f"{girest_server}/Gst/Element/ptr,{identity_ptr}/foreach_pad",
            params={"func": callback_url},
            headers={"session-id": "test-session-123", "callback-secret": "test-secret-456"},
        )
        assert_api_success(response, "Failed to call foreach_pad")
        result_data = response.json()

        # Step 4: Verify we received callbacks for BOTH pads (since we returned True)
        assert len(received_pads) == 2, f"Expected 2 pad callbacks (continued iteration), got {len(received_pads)}"

        # Verify both pads are different
        assert received_pads[0] != received_pads[1], f"Expected different pads, got same: {received_pads[0]}"

        # Verify all callbacks are stored
        all_callbacks = callback_server.get_callbacks("foreach_pad_test")
        assert len(all_callbacks) == 2, f"Expected 2 callbacks stored, got {len(all_callbacks)}"

        # Step 5: Verify the method completed successfully
        assert "return" in result_data
        assert isinstance(result_data["return"], bool)


@pytest.mark.asyncio
async def test_call_scope_stops_on_false(girest_server, callback_server, gst_identity_factory):
    """
    Test that call-scope callbacks stop iteration when returning False.

    This test uses an identity element which has 2 pads (sink and src).
    When the callback returns False on the first invocation, iteration
    should stop and only 1 pad should be visited.
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Create an identity element (has sink and src pads)
        identity_ptr = await gst_identity_factory("test_identity")

        # Step 2: Set up callback handler that returns False (stop iteration)
        received_pads = []

        def my_callback_handler(callback_data):
            """Custom handler that tracks pads and returns False to stop iteration."""
            args = assert_callback_invocation(callback_data, expected_args=["element", "pad", "user_data"])
            received_pads.append(args["pad"]["ptr"])
            return False  # Stop iteration after first callback

        callback_server.set_callback_handler("foreach_pad_test", my_callback_handler)

        # Step 3: Call foreach_pad with our callback URL
        callback_url = callback_server.callback_url("foreach_pad_test")

        response = await client.get(
            f"{girest_server}/Gst/Element/ptr,{identity_ptr}/foreach_pad",
            params={"func": callback_url},
            headers={"session-id": "test-session-123", "callback-secret": "test-secret-456"},
        )
        assert_api_success(response, "Failed to call foreach_pad")
        result_data = response.json()

        # Step 4: Verify we received callback for ONLY ONE pad (since we returned False)
        assert len(received_pads) == 1, f"Expected 1 pad callback (stopped iteration), got {len(received_pads)}"

        # Verify only one callback is stored
        all_callbacks = callback_server.get_callbacks("foreach_pad_test")
        assert len(all_callbacks) == 1, f"Expected 1 callback stored, got {len(all_callbacks)}"

        # Step 5: Verify the method completed successfully
        assert "return" in result_data
        assert isinstance(result_data["return"], bool)


@pytest.mark.asyncio
async def test_call_scope_reentrancy(girest_server, callback_server, gst_identity_factory):
    """
    Test that Frida handles reentrancy correctly when call-scope callbacks make API calls.

    This test verifies that when a callback makes synchronous API calls back to
    the server (ref/unref on the pad), Frida properly handles the reentrant calls
    without deadlocking or crashing.

    The sequence is:
    1. Client calls foreach_pad (blocks waiting for response)
    2. Server invokes callback, POSTs to client's callback URL (blocks)
    3. Client's callback handler makes API calls (ref/unref pad) - REENTRANT
    4. Server processes ref/unref while still in the foreach_pad call
    5. Callback completes, foreach_pad continues
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Create an identity element (has sink and src pads)
        identity_ptr = await gst_identity_factory("test_identity")

        # Step 2: Set up callback handler that makes reentrant API calls
        received_pads = []
        reentrant_calls_succeeded = []

        def reentrant_callback_handler(callback_data):
            """Handler that makes reentrant API calls (ref/unref) on the pad."""
            args = assert_callback_invocation(callback_data, expected_args=["element", "pad", "user_data"])
            pad = args["pad"]
            assert_has_ptr(pad)
            pad_ptr = pad["ptr"]
            received_pads.append(pad_ptr)

            # Make reentrant API calls: ref the pad, then unref it
            # This tests that Frida can handle API calls while processing a callback
            try:
                ref_response = httpx.get(f"{girest_server}/Gst/Object/ptr,{pad_ptr}/ref", timeout=10.0)
                assert_api_success(ref_response, "Reentrant ref call failed")
                ref_data = ref_response.json()
                assert "return" in ref_data
                assert_has_ptr(ref_data["return"])

                unref_response = httpx.get(f"{girest_server}/Gst/Object/ptr,{pad_ptr}/unref", timeout=10.0)
                assert_api_success(unref_response, "Reentrant unref call failed")

                reentrant_calls_succeeded.append(True)
            except Exception:
                reentrant_calls_succeeded.append(False)

            return True  # Continue iteration

        callback_server.set_callback_handler("reentrancy_test", reentrant_callback_handler)

        # Step 3: Call foreach_pad with our callback URL
        callback_url = callback_server.callback_url("reentrancy_test")

        response = await client.get(
            f"{girest_server}/Gst/Element/ptr,{identity_ptr}/foreach_pad",
            params={"func": callback_url},
            headers={"session-id": "test-session-123", "callback-secret": "test-secret-456"},
        )
        assert_api_success(response, "Failed to call foreach_pad")
        result_data = response.json()

        # Step 4: Verify we received callbacks for both pads
        assert len(received_pads) == 2, f"Expected 2 pad callbacks, got {len(received_pads)}"

        # Verify both pads are different
        assert received_pads[0] != received_pads[1], f"Expected different pads, got same: {received_pads[0]}"

        # Verify all reentrant calls succeeded
        assert (
            len(reentrant_calls_succeeded) == 2
        ), f"Expected 2 reentrant call attempts, got {len(reentrant_calls_succeeded)}"
        assert all(reentrant_calls_succeeded), "Some reentrant API calls failed"

        # Step 5: Verify the method completed successfully
        assert "return" in result_data
        assert isinstance(result_data["return"], bool)


# ============================================================================
# Async Scope Tests (Signals)
# ============================================================================


@pytest.mark.asyncio
async def test_async_scope(girest_server, callback_server, gst_bin_factory, gst_identity_factory):
    """
    Test GObject signal connection and disconnection (async-scope callbacks).

    Signals use GI_SCOPE_TYPE_ASYNC, meaning they're invoked AFTER the method
    that triggers them returns (asynchronous from the caller's perspective).
    However, the HTTP callback is still synchronous - we wait for it to complete.

    This test verifies:
    1. Signals can be connected with a callback URL
    2. Signals are triggered when the event occurs (after method returns)
    3. Signals can be disconnected
    4. Disconnected signals are not triggered

    Uses the 'element-added' signal on GstBin which fires when a child element is added.
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Create a bin
        bin_ptr = await gst_bin_factory("test_bin")

        # Step 2: Connect to the element-added signal
        signal_triggered = []

        def signal_handler(callback_data):
            """Handler for element-added signal."""
            # Signal callbacks include 'self' (the emitter) as first parameter
            args = assert_callback_invocation(callback_data, expected_args=["self", "element"])

            # Verify 'self' is the bin that emitted the signal
            assert (
                args["self"]["ptr"] == bin_ptr
            ), f"Signal 'self' parameter should be bin {bin_ptr}, got {args['self']['ptr']}"

            signal_triggered.append({"self": args["self"]["ptr"], "element": args["element"]["ptr"]})
            return None  # Signals don't return values

        callback_server.set_callback_handler("element_added_signal", signal_handler)
        callback_url = callback_server.callback_url("element_added_signal")

        response = await client.post(
            f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/signals/element-added/connect",
            json={"flags": "default", "handler": callback_url},
            headers={"session-id": "test-session-signal", "callback-secret": "test-secret-signal"},
        )
        assert_api_success(response, "Failed to connect to element-added signal")
        signal_data = response.json()
        assert "return" in signal_data
        signal_id = signal_data["return"]
        assert isinstance(signal_id, int) or isinstance(signal_id, str)
        assert int(signal_id) > 0, f"Invalid signal ID: {signal_id}"

        # Step 3: Create an identity element
        identity1_ptr = await gst_identity_factory("identity1")

        # Step 4: Add the identity to the bin
        response = await client.get(
            f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/add", params={"element": f"ptr,{identity1_ptr}"}
        )
        assert_api_success(response, "Failed to add identity1 to bin")

        # Give signal a moment to trigger
        await asyncio.sleep(0.5)

        # Step 5: Confirm that the signal was triggered
        assert len(signal_triggered) == 1, f"Expected 1 signal trigger, got {len(signal_triggered)}"
        assert signal_triggered[0]["element"] == identity1_ptr, "Signal element pointer doesn't match identity1"

        # Step 6: Remove the signal handler
        response = await client.get(
            f"{girest_server}/GObject/signal_handler_disconnect",
            params={"instance": f"ptr,{bin_ptr}", "handler_id": signal_id},
        )
        assert_api_success(response, "Failed to disconnect signal")

        # Clear the signal tracking
        signal_triggered.clear()

        # Step 7: Create a new identity
        identity2_ptr = await gst_identity_factory("identity2")

        # Step 8: Add the identity to the bin
        response = await client.get(
            f"{girest_server}/Gst/Bin/ptr,{bin_ptr}/add", params={"element": f"ptr,{identity2_ptr}"}
        )
        assert_api_success(response, "Failed to add identity2 to bin")

        # Give signal a moment (if it were to trigger)
        await asyncio.sleep(0.5)

        # Step 9: Confirm that the signal was NOT triggered again
        assert (
            len(signal_triggered) == 0
        ), f"Signal should not trigger after disconnect, but got {len(signal_triggered)} triggers"
