"""
Callback handling and security for GIRest HTTP callbacks.

This module provides classes for secure callback invocations, supporting both
synchronous callbacks (that wait for a return value) and asynchronous callbacks
(fire-and-forget), with HMAC signature authentication.
"""

import hmac
import hashlib
import json
import logging
import requests
import asyncio
import time
from typing import Any, Optional, Dict, List
from datetime import datetime, timezone
from collections import deque

logger = logging.getLogger(__name__)


class CallbackSecurity:
    """Handles HMAC signature generation for callback requests."""
    
    def __init__(self, secret_key: str):
        """
        Initialize with a shared secret key.
        
        Args:
            secret_key: Shared secret between girest and the callback receiver
        """
        self.secret_key = secret_key.encode() if isinstance(secret_key, str) else secret_key
    
    def create_headers(self, payload: Dict[str, Any]) -> Dict[str, str]:
        """
        Create signed headers for a callback HTTP request.
        
        The signature is generated using HMAC-SHA256 over a message consisting
        of the timestamp and the canonical JSON representation of the payload.
        
        Args:
            payload: Dictionary containing the callback data
            
        Returns:
            Dictionary of HTTP headers including signature and timestamp
            
        Example:
            >>> security = CallbackSecurity('my-secret-key')
            >>> headers = security.create_headers({'eventId': 'evt-001', 'data': 'test'})
            >>> print(headers['X-Callback-Signature'])
        """
        timestamp = datetime.now(timezone.utc).isoformat()
        signature = self.sign_payload(payload, timestamp)
        
        return {
            'X-Callback-Signature': signature,
            'X-Callback-Timestamp': timestamp,
            'X-Event-Id': str(payload.get('eventId', '')),
            'Content-Type': 'application/json'
        }
    
    def sign_payload(self, payload: Dict[str, Any], timestamp: str) -> str:
        """
        Generate HMAC signature for a callback payload.
        
        The message to sign is: "{timestamp}.{canonical_json}"
        where canonical_json uses sorted keys and no whitespace.
        
        Args:
            payload: Dictionary to sign
            timestamp: ISO format timestamp string
            
        Returns:
            Hexadecimal signature string
        """
        # Create canonical JSON representation (sorted keys, no whitespace)
        canonical_json = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        
        # Create message: timestamp.payload
        message = f"{timestamp}.{canonical_json}"
        
        # Generate HMAC-SHA256 signature
        signature = hmac.new(
            self.secret_key,
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def verify_signature(
        self,
        payload: Dict[str, Any],
        timestamp: str,
        provided_signature: str
    ) -> bool:
        """
        Verify that a signature is valid for the given payload and timestamp.
        
        Args:
            payload: Dictionary to verify
            timestamp: ISO format timestamp string
            provided_signature: Signature to verify
            
        Returns:
            True if signature is valid, False otherwise
        """
        expected_signature = self.sign_payload(payload, timestamp)
        
        # Use constant-time comparison to prevent timing attacks
        return hmac.compare_digest(provided_signature, expected_signature)


class CallbackHandler:
    """
    Handles HTTP callback invocations for GObject callbacks.
    
    This class is responsible for:
    - Serializing callback arguments
    - Signing requests with HMAC
    - Making HTTP POST requests to callback URLs
    - Handling timeouts and errors gracefully
    """
    
    def __init__(
        self,
        callback_url: Optional[str],
        session_id: str,
        secret: str,
        timeout: int = 10
    ):
        """
        Initialize the callback handler.
        
        Args:
            callback_url: URL to POST callbacks to (None disables callbacks)
            session_id: Unique session identifier for routing
            secret: Shared secret for HMAC signatures
            timeout: HTTP request timeout in seconds
        """
        self.callback_url = callback_url
        self.session_id = session_id
        self.timeout = timeout
        self.security = CallbackSecurity(secret) if callback_url else None
        self.invocation_count = 0
        
        # Statistics
        self.stats = {
            'total_invocations': 0,
            'successful_invocations': 0,
            'failed_invocations': 0,
            'total_time_ms': 0
        }
    
    def is_enabled(self) -> bool:
        """Check if callback handler is enabled (has a URL)."""
        return self.callback_url is not None and self.security is not None
    
    def call_async(self, callback_name: str, data: Any) -> None:
        """
        Call an asynchronous callback (fire-and-forget).
        
        This method doesn't wait for or return a response. Use for event
        notifications where no return value is needed.
        
        Args:
            callback_name: Name of the callback being invoked
            data: Arbitrary data to send (will be JSON-serialized)
        """
        if not self.is_enabled():
            logger.debug(f"Callback {callback_name} skipped (handler disabled)")
            return
        
        self.invocation_count += 1
        event_id = f'{self.session_id}_{self.invocation_count}'
        
        payload = {
            'eventId': event_id,
            'sessionId': self.session_id,
            'callbackName': callback_name,
            'type': 'callback',
            'payload': data,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        self._post_callback(payload)
    
    def call_sync(self, callback_name: str, *args) -> Any:
        """
        Call a synchronous callback and wait for return value.
        
        This method makes a blocking HTTP request and returns the result.
        Use for callbacks like foreach() that need a return value to continue.
        
        Args:
            callback_name: Name of the callback being invoked
            *args: Arguments to pass to the callback
            
        Returns:
            The return value from the callback, or None on error
        """
        if not self.is_enabled():
            logger.debug(f"Callback {callback_name} skipped (handler disabled)")
            return None
        
        self.invocation_count += 1
        
        payload = {
            'sessionId': self.session_id,
            'callbackName': callback_name,
            'args': self._serialize_args(args),
            'invocationNumber': self.invocation_count,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        response_data = self._post_callback(payload, expect_response=True)
        
        if response_data:
            return self._deserialize_result(response_data.get('result'))
        
        return None
    
    def _post_callback(
        self,
        payload: Dict[str, Any],
        expect_response: bool = False
    ) -> Optional[Dict[str, Any]]:
        """
        Make HTTP POST request to callback URL.
        
        Args:
            payload: Dictionary to send as JSON body
            expect_response: Whether to parse and return response JSON
            
        Returns:
            Response JSON if expect_response=True, otherwise None
        """
        if not self.callback_url or not self.security:
            return None
        
        headers = self.security.create_headers(payload)
        
        import time
        start_time = time.time()
        
        try:
            self.stats['total_invocations'] += 1
            
            logger.debug(f"Posting callback to {self.callback_url}")
            
            response = requests.post(
                self.callback_url,
                json=payload,
                headers=headers,
                timeout=self.timeout
            )
            
            elapsed_ms = (time.time() - start_time) * 1000
            self.stats['total_time_ms'] += elapsed_ms
            
            response.raise_for_status()
            
            self.stats['successful_invocations'] += 1
            
            logger.debug(
                f"Callback posted successfully ({elapsed_ms:.2f}ms): "
                f"{payload.get('callbackName', 'unknown')}"
            )
            
            if expect_response:
                return response.json()
            
            return None
            
        except requests.exceptions.Timeout:
            logger.error(
                f"Callback timeout after {self.timeout}s: "
                f"{payload.get('callbackName', 'unknown')}"
            )
            self.stats['failed_invocations'] += 1
            return None
            
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Callback request failed: {e} "
                f"({payload.get('callbackName', 'unknown')})"
            )
            self.stats['failed_invocations'] += 1
            return None
            
        except Exception as e:
            logger.error(
                f"Unexpected error in callback: {e} "
                f"({payload.get('callbackName', 'unknown')})"
            )
            self.stats['failed_invocations'] += 1
            return None
    
    def _serialize_args(self, args: tuple) -> list:
        """
        Convert GObject callback arguments to JSON-serializable format.
        
        Args:
            args: Tuple of arguments from GObject callback
            
        Returns:
            List of JSON-serializable values
        """
        result = []
        for arg in args:
            result.append(self._serialize_value(arg))
        return result
    
    def _serialize_value(self, value: Any) -> Any:
        """
        Convert a single value to JSON-serializable format.
        
        Handles common GObject types and converts them to primitives.
        
        Args:
            value: Value to serialize
            
        Returns:
            JSON-serializable representation
        """
        # Handle None
        if value is None:
            return None
        
        # Handle primitives
        if isinstance(value, (bool, int, float, str)):
            return value
        
        # Handle lists/tuples
        if isinstance(value, (list, tuple)):
            return [self._serialize_value(v) for v in value]
        
        # Handle dicts
        if isinstance(value, dict):
            return {k: self._serialize_value(v) for k, v in value.items()}
        
        # Handle objects with __dict__
        if hasattr(value, '__dict__'):
            return str(value)
        
        # Fallback: convert to string
        return str(value)
    
    def _deserialize_result(self, result: Any) -> Any:
        """
        Convert result from JSON back to appropriate Python type.
        
        Args:
            result: JSON value from callback response
            
        Returns:
            Python value
        """
        # Most types are already correct from JSON
        return result
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about callback invocations.
        
        Returns:
            Dictionary with statistics
        """
        stats = self.stats.copy()
        
        if stats['total_invocations'] > 0:
            stats['success_rate'] = (
                stats['successful_invocations'] / stats['total_invocations']
            )
            stats['avg_time_ms'] = (
                stats['total_time_ms'] / stats['total_invocations']
            )
        else:
            stats['success_rate'] = 0.0
            stats['avg_time_ms'] = 0.0
        
        return stats


class CallbackBatcher:
    """
    Batches high-frequency callbacks before sending to reduce HTTP overhead.
    
    This class accumulates callback events in a buffer and sends them in batches,
    either when the batch reaches a maximum size or after a timeout period.
    This significantly reduces network overhead for high-frequency events.
    """
    
    def __init__(
        self,
        callback_url: str,
        session_id: str,
        secret: str,
        max_batch_size: int = 50,
        max_wait_ms: int = 100,
        timeout: int = 10
    ):
        """
        Initialize the callback batcher.
        
        Args:
            callback_url: URL to POST batched callbacks to
            session_id: Unique session identifier for routing
            secret: Shared secret for HMAC signatures
            max_batch_size: Maximum events per batch (triggers immediate send)
            max_wait_ms: Maximum time to wait before sending partial batch
            timeout: HTTP request timeout in seconds
        """
        self.callback_url = callback_url
        self.session_id = session_id
        self.secret = secret
        self.max_batch_size = max_batch_size
        self.max_wait_seconds = max_wait_ms / 1000.0
        self.timeout = timeout
        
        self.security = CallbackSecurity(secret)
        self.buffer: deque = deque()
        self.event_counter = 0
        self.last_flush = time.time()
        self.flush_task: Optional[asyncio.Task] = None
        self._session: Optional[requests.Session] = None
        
        # Statistics
        self.stats = {
            'events_buffered': 0,
            'batches_sent': 0,
            'events_sent': 0,
            'errors': 0,
            'total_time_ms': 0
        }
    
    def _get_session(self) -> requests.Session:
        """Get or create HTTP session for connection reuse."""
        if self._session is None:
            self._session = requests.Session()
        return self._session
    
    def add_event(self, callback_name: str, payload: Any) -> None:
        """
        Add event to buffer (synchronous, called from GObject callback).
        
        This method is designed to be called from GObject callbacks and
        should be very fast. It just adds to the buffer and may trigger
        a flush if the batch is full.
        
        Args:
            callback_name: Name of the callback being invoked
            payload: Data to send (will be JSON-serialized)
        """
        self.event_counter += 1
        event_id = f'{self.session_id}_{self.event_counter}'
        
        event = {
            'eventId': event_id,
            'callbackName': callback_name,
            'payload': payload,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        self.buffer.append(event)
        self.stats['events_buffered'] += 1
        
        # Trigger immediate flush if batch is full
        if len(self.buffer) >= self.max_batch_size:
            self.flush()
        
        # Start flush timer if not running
        elif self.flush_task is None or self.flush_task.done():
            # For sync context, we check time and flush if needed
            if time.time() - self.last_flush >= self.max_wait_seconds:
                self.flush()
    
    def flush(self) -> None:
        """
        Send batched events to callback URL (synchronous).
        
        This collects all buffered events and sends them as a single batch.
        If the buffer is empty, this is a no-op.
        """
        if not self.buffer:
            return
        
        # Swap buffer (collect all pending events)
        events_to_send = list(self.buffer)
        self.buffer.clear()
        
        batch_id = f'batch_{self.session_id}_{int(time.time() * 1000)}'
        
        payload = {
            'batchId': batch_id,
            'sessionId': self.session_id,
            'type': 'batch',
            'events': events_to_send,
            'count': len(events_to_send),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        # Generate signature
        headers = self.security.create_headers(payload)
        
        start_time = time.time()
        
        try:
            logger.debug(f"Sending batch {batch_id} with {len(events_to_send)} events")
            
            session = self._get_session()
            response = session.post(
                self.callback_url,
                json=payload,
                headers=headers,
                timeout=self.timeout
            )
            
            elapsed_ms = (time.time() - start_time) * 1000
            self.stats['total_time_ms'] += elapsed_ms
            
            response.raise_for_status()
            
            self.stats['batches_sent'] += 1
            self.stats['events_sent'] += len(events_to_send)
            self.last_flush = time.time()
            
            logger.info(
                f"Batch {batch_id} delivered: {len(events_to_send)} events "
                f"in {elapsed_ms:.2f}ms (total: {self.stats['events_sent']})"
            )
            
        except requests.exceptions.Timeout:
            self.stats['errors'] += 1
            logger.error(
                f"Batch {batch_id} timeout after {self.timeout}s "
                f"({len(events_to_send)} events lost)"
            )
            
        except requests.exceptions.RequestException as e:
            self.stats['errors'] += 1
            logger.error(
                f"Failed to send batch {batch_id}: {e} "
                f"({len(events_to_send)} events lost)"
            )
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(
                f"Unexpected error sending batch {batch_id}: {e} "
                f"({len(events_to_send)} events lost)"
            )
    
    async def flush_async(self) -> None:
        """
        Send batched events asynchronously (for async contexts).
        
        This is the async version of flush() for use in async/await contexts.
        """
        if not self.buffer:
            return
        
        # Swap buffer
        events_to_send = list(self.buffer)
        self.buffer.clear()
        
        batch_id = f'batch_{self.session_id}_{int(time.time() * 1000)}'
        
        payload = {
            'batchId': batch_id,
            'sessionId': self.session_id,
            'type': 'batch',
            'events': events_to_send,
            'count': len(events_to_send),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        headers = self.security.create_headers(payload)
        
        try:
            # Note: In async context, would use aiohttp instead
            # For now, run in executor to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                self._send_batch_sync,
                payload,
                headers,
                batch_id,
                len(events_to_send)
            )
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Async flush failed for batch {batch_id}: {e}")
    
    def _send_batch_sync(
        self,
        payload: Dict[str, Any],
        headers: Dict[str, str],
        batch_id: str,
        event_count: int
    ) -> None:
        """Helper method to send batch synchronously (for async executor)."""
        start_time = time.time()
        
        try:
            session = self._get_session()
            response = session.post(
                self.callback_url,
                json=payload,
                headers=headers,
                timeout=self.timeout
            )
            
            elapsed_ms = (time.time() - start_time) * 1000
            self.stats['total_time_ms'] += elapsed_ms
            
            response.raise_for_status()
            
            self.stats['batches_sent'] += 1
            self.stats['events_sent'] += event_count
            self.last_flush = time.time()
            
            logger.info(
                f"Batch {batch_id} delivered: {event_count} events "
                f"in {elapsed_ms:.2f}ms"
            )
            
        except Exception as e:
            raise
    
    def close(self) -> None:
        """
        Flush remaining events and cleanup resources.
        
        Call this when done with the batcher to ensure no events are lost.
        """
        # Flush any remaining events
        self.flush()
        
        # Close HTTP session
        if self._session:
            self._session.close()
            self._session = None
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about batch operations.
        
        Returns:
            Dictionary with statistics including compression ratio
        """
        stats = self.stats.copy()
        
        # Calculate compression ratio (events per batch)
        if stats['batches_sent'] > 0:
            stats['compression_ratio'] = (
                stats['events_sent'] / stats['batches_sent']
            )
            stats['avg_batch_time_ms'] = (
                stats['total_time_ms'] / stats['batches_sent']
            )
        else:
            stats['compression_ratio'] = 0.0
            stats['avg_batch_time_ms'] = 0.0
        
        stats['buffer_size'] = len(self.buffer)
        stats['pending_events'] = len(self.buffer)
        
        return stats

