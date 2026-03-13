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
    
    def invoke(self, callback_name: str, callback_id: int, args: Dict[str, Any]) -> Any:
        """
        Invoke a callback with the given arguments.
        
        This method makes a synchronous HTTP request and waits for the response.
        All callbacks are handled the same way regardless of GI scope:
        - Makes blocking HTTP POST to callback URL
        - Waits for response
        - Returns the result (may be None if callback has no return value)
        
        The GI scope (call/async/notified/forever) only affects WHEN the callback
        is invoked relative to the caller, not HOW we handle the HTTP request.
        
        Args:
            callback_name: Name of the callback being invoked
            callback_id: Callback ID for correlation tracking (thread affinity)
            args: Dictionary of arguments (already JSON-serializable from _convert_callback_args)
            
        Returns:
            The return value from the callback, or None if no return value
        """
        if not self.is_enabled():
            logger.debug(f"Callback {callback_name} skipped (handler disabled)")
            return None
        
        self.invocation_count += 1
        
        payload = {
            'sessionId': self.session_id,
            'callbackName': callback_name,
            'args': args,  # Use args dict directly, no serialization needed
            'invocationNumber': self.invocation_count,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'correlationId': str(callback_id)  # For thread affinity tracking
        }
        
        response_data = self._post_callback(payload, expect_response=True)
        
        if response_data:
            return response_data.get('return')  # No deserialization needed
        
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
            
            logger.debug(f"Posting callback to {self.callback_url} with payload: {payload}")
            
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

