/**
 * Callback Registry Hook
 *
 * Manages callback execution for GIRest callbacks invoked from the server.
 * Uses the shared WebSocket connection to receive callback invocations
 * and send results back.
 *
 * Works with ClientCallbackHandler to invoke callbacks registered in the browser.
 */

import { useCallback } from 'react';
import { getCallbackHandler } from '@/lib/gst';
import type { ClientCallbackHandler } from '@/lib/callbacks';
import { useWebSocket, WebSocketMessage } from './useWebSocket';

interface CallbackMessage extends WebSocketMessage {
  type: 'callback';
  callbackId: string;
  invocationId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
}

interface UseCallbackRegistryOptions {
  sessionId: string;
  wsUrl?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface CallbackRegistryReturn {
  isConnected: boolean;
  reconnect: () => void;
}

/**
 * Hook for managing callback registry via WebSocket.
 * 
 * This hook:
 * 1. Connects to the WebSocket server
 * 2. Listens for 'callback' messages
 * 3. Executes the registered callback function
 * 4. Sends the result back via WebSocket
 */
export function useCallbackRegistry(
  options: UseCallbackRegistryOptions
): CallbackRegistryReturn {
  const {
    sessionId,
    wsUrl = 'ws://localhost:3000/ws',
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  // Handle callback messages
  const handleMessage = useCallback(async (message: WebSocketMessage) => {
    // Only process 'callback' messages
    if (message.type !== 'callback') return;

    const callbackMsg = message as CallbackMessage;
    const invocationId = callbackMsg.invocationId || callbackMsg.callbackId;
    
    console.log(`[CallbackRegistry] Received callback: ${invocationId} (registration: ${callbackMsg.callbackId})`);
    
    // Get the callback handler
    const handler = getCallbackHandler();
    if (!handler) {
      console.error('[CallbackRegistry] No callback handler configured');
      return;
    }

    // Look up the callback in ClientCallbackHandler using the registration callbackId
    const callbackInfo = (handler as ClientCallbackHandler).getCallback?.(callbackMsg.callbackId);
    if (!callbackInfo) {
      console.warn(`[CallbackRegistry] Callback not found: ${callbackMsg.callbackId}`);
      return;
    }

    // Execute callback and send result back
    let result = null;
    try {
      // Apply converter function to transform raw args to typed args
      const convertedArgs = await callbackInfo.converter(callbackMsg.args);
      console.log(`[CallbackRegistry] Invoking callback ${invocationId}`);
      
      // Invoke the actual callback function and capture result
      result = await callbackInfo.func(...convertedArgs);
      console.log(`[CallbackRegistry] Callback ${invocationId} returned:`, result);
    } catch (error) {
      console.error(`[CallbackRegistry] Error invoking callback ${invocationId}:`, error);
      result = null;
    }

    // Send result back to server via WebSocket
    try {
      ws.sendMessage({
        type: 'callback-response',
        invocationId: invocationId,
        callbackId: callbackMsg.callbackId,
        result: result
      });
      console.log(`[CallbackRegistry] Callback response sent for ${invocationId}`);
    } catch (error) {
      console.error(`[CallbackRegistry] Error sending callback response:`, error);
    }
  }, []);

  // Use shared WebSocket with message handler
  const ws = useWebSocket({
    sessionId,
    wsUrl,
    autoConnect,
    onConnect,
    onDisconnect,
    onError,
    onMessage: handleMessage,
  });

  return {
    isConnected: ws.isConnected,
    reconnect: ws.reconnect,
  };
}
