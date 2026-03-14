/**
 * Callback Registry Hook
 *
 * Manages a SHARED WebSocket connection for receiving real-time callbacks.
 * Multiple components can use this hook with the same sessionId,
 * and they will share a single WebSocket connection.
 *
 * Works with ClientCallbackHandler to invoke callbacks registered in the browser.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { getCallbackHandler } from '@/lib/gst';
import type { ClientCallbackHandler } from '@/lib/callbacks';

interface CallbackMessage {
  type: string;
  callbackId: string;
  invocationId?: string;  // Unique ID for this specific invocation
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

// ============================================================================
// Shared WebSocket Manager (Singleton per sessionId)
// ============================================================================

interface WebSocketListener {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface WebSocketInstance {
  ws: WebSocket | null;
  refCount: number;
  isConnected: boolean;
  listeners: Set<WebSocketListener>;
  reconnectTimeout?: NodeJS.Timeout;
}

// Global map: sessionId → WebSocket instance
const wsInstances = new Map<string, WebSocketInstance>();

function getOrCreateWebSocket(
  sessionId: string,
  wsUrl: string,
  autoConnect: boolean
): WebSocketInstance {
  let instance = wsInstances.get(sessionId);

  if (!instance) {
    console.log(`[WebSocketManager] Creating new WebSocket instance for session: ${sessionId}`);

    instance = {
      ws: null,
      refCount: 0,
      isConnected: false,
      listeners: new Set(),
    };

    wsInstances.set(sessionId, instance);

    if (autoConnect) {
      console.log(`[WebSocketManager] Auto-connecting to: ${wsUrl}`);
      connectWebSocket(sessionId, wsUrl);
    } else {
      console.log(`[WebSocketManager] Not auto-connecting (autoConnect=false)`);
    }
  }

  return instance;
}

function connectWebSocket(sessionId: string, wsUrl: string) {
  const instance = wsInstances.get(sessionId);
  if (!instance) return;

  if (instance.ws?.readyState === WebSocket.OPEN) {
    console.log(`[WebSocketManager] WebSocket already connected for session: ${sessionId}`);
    return;
  }

  // Build WebSocket URL with sessionId parameter
  const url = new URL(wsUrl);
  url.searchParams.set('sessionId', sessionId);
  const fullWsUrl = url.toString();

  console.log(`[WebSocketManager] Connecting to: ${fullWsUrl}`);

  try {
    const ws = new WebSocket(fullWsUrl);
    instance.ws = ws;

    ws.onopen = () => {
      console.log(`[WebSocketManager] WebSocket connected for session: ${sessionId}`);
      instance.isConnected = true;
      // Notify all listeners
      instance.listeners.forEach(listener => listener.onConnect?.());
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`[WebSocketManager] Received message:`, message.type);
        switch (message.type) {
          case 'connected':
          case 'registered':
            console.log(`[WebSocketManager] Session registered: ${sessionId}`);
            break;

          case 'callback':
            handleCallbackMessage(message, ws);
            break;

          case 'pong':
            // Heartbeat response
            break;

          default:
            console.warn(`[WebSocketManager] Unknown message type:`, message.type);
        }
      } catch (error) {
        console.error(`[WebSocketManager] Error parsing message:`, error);
      }
    };

    ws.onerror = (event) => {
      console.error(`[WebSocketManager] WebSocket error:`, event);
      const error = new Error('WebSocket error');
      instance.listeners.forEach(listener => listener.onError?.(error));
    };

    ws.onclose = () => {
      console.log(`[WebSocketManager] WebSocket disconnected for session: ${sessionId}`);
      instance.isConnected = false;
      // Notify all listeners
      instance.listeners.forEach(listener => listener.onDisconnect?.());

      // Auto-reconnect after 5 seconds if there are still active listeners
      if (instance.refCount > 0) {
        console.log(`[WebSocketManager] Reconnecting in 5 seconds... (${instance.refCount} active users)`);
        instance.reconnectTimeout = setTimeout(() => {
          connectWebSocket(sessionId, wsUrl);
        }, 5000);
      }
    };
  } catch (error) {
    console.error(`[WebSocketManager] Error creating WebSocket:`, error);
    instance.listeners.forEach(listener => listener.onError?.(error as Error));
  }
}

function handleCallbackMessage(message: CallbackMessage, ws: WebSocket) {
  const invocationId = message.invocationId || message.callbackId;
  console.log(`[WebSocketManager] Received callback: ${invocationId} (registration: ${message.callbackId})`);
  
  // Get the callback handler
  const handler = getCallbackHandler();
  if (!handler) {
    console.error('[WebSocketManager] No callback handler configured');
    return;
  }

  // Look up the callback in ClientCallbackHandler using the registration callbackId
  const callbackInfo = (handler as ClientCallbackHandler).getCallback?.(message.callbackId);
  if (!callbackInfo) {
    console.warn(`[WebSocketManager] Callback not found: ${message.callbackId}`);
    return;
  }

  // Execute callback and send result back to server via WebSocket
  (async () => {
    let result = null;
    try {
      // Apply converter function to transform raw args to typed args
      // Converter may be async, so await it
      const convertedArgs = await callbackInfo.converter(message.args);
      console.log(`[WebSocketManager] Invoking callback ${invocationId}`);
      
      // Invoke the actual callback function and capture result
      result = await callbackInfo.func(...convertedArgs);
      console.log(`[WebSocketManager] Callback ${invocationId} returned:`, result);
    } catch (error) {
      console.error(`[WebSocketManager] Error invoking callback ${invocationId}:`, error);
      result = null;
    }

    // Send result back to server via WebSocket with invocationId
    try {
      ws.send(JSON.stringify({
        type: 'callback-response',
        invocationId: invocationId,  // Use unique invocation ID
        callbackId: message.callbackId,  // Keep original for reference
        result: result
      }));
      console.log(`[WebSocketManager] Callback response sent for ${invocationId}`);
    } catch (error) {
      console.error(`[WebSocketManager] Error sending callback response:`, error);
    }
  })();
}

function addListener(
  sessionId: string,
  listener: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
  }
) {
  const instance = wsInstances.get(sessionId);
  if (instance) {
    instance.listeners.add(listener);
    instance.refCount++;
  }
}

function removeListener(
  sessionId: string,
  listener: WebSocketListener
) {
  const instance = wsInstances.get(sessionId);
  if (instance) {
    instance.listeners.delete(listener);
    instance.refCount--;
    // If no more listeners, close the WebSocket after a delay
    if (instance.refCount === 0) {
      console.log(`[WebSocketManager] No more listeners for session ${sessionId}, closing in 10s`);
      setTimeout(() => {
        const inst = wsInstances.get(sessionId);
        if (inst && inst.refCount === 0) {
          console.log(`[WebSocketManager] Closing WebSocket for session: ${sessionId}`);
          inst.ws?.close();
          wsInstances.delete(sessionId);
        }
      }, 10000);
    }
  }
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * Hook for managing WebSocket connection and executing callbacks.
 * Multiple components can use this hook with the same sessionId.
 */
export function useCallbackRegistry(
  options: UseCallbackRegistryOptions
): CallbackRegistryReturn {
  const {
    sessionId,
    wsUrl = 'ws://localhost:3000/ws',  // Match the WebSocket path from server.js
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const listenerRef = useRef<WebSocketListener | null>(null);
  const prevAutoConnectRef = useRef<boolean>(autoConnect);
  const prevWsUrlRef = useRef<string>(wsUrl);
  
  // Use refs for callbacks to avoid recreating listener
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onConnect, onDisconnect, onError]);

  // Effect 1: Set up listener (only depends on sessionId)
  useEffect(() => {
    // Don't connect if sessionId is empty (SSR or initial render)
    if (!sessionId) {
      console.log('[WebSocketManager] Skipping WebSocket setup - no sessionId');
      return;
    }

    console.log('[WebSocketManager] Setting up listener for session:', sessionId);

    // Create listener object with stable callbacks via refs
    const listener = {
      onConnect: () => {
        setIsConnected(true);
        onConnectRef.current?.();
      },
      onDisconnect: () => {
        setIsConnected(false);
        onDisconnectRef.current?.();
      },
      onError: (error: Error) => {
        onErrorRef.current?.(error);
      }
    };
    listenerRef.current = listener;

    // Get or create shared WebSocket instance (but don't auto-connect yet)
    const instance = getOrCreateWebSocket(sessionId, wsUrl, false);
    
    // Register this component as a listener
    addListener(sessionId, listener);
    
    // Set initial connection state
    setIsConnected(instance.isConnected);

    // Cleanup on unmount only
    return () => {
      if (listenerRef.current) {
        console.log('[WebSocketManager] Removing listener for session:', sessionId);
        removeListener(sessionId, listenerRef.current);
      }
    };
  }, [sessionId]); // Only re-run if sessionId changes

  // Effect 2: Handle connection when autoConnect or wsUrl changes
  useEffect(() => {
    if (!sessionId || !autoConnect) {
      return;
    }

    // Check if wsUrl or autoConnect actually changed
    const wsUrlChanged = prevWsUrlRef.current !== wsUrl;
    const autoConnectChanged = prevAutoConnectRef.current !== autoConnect;

    if (wsUrlChanged || autoConnectChanged) {
      console.log('[WebSocketManager] Connection params changed:', { 
        wsUrl, 
        autoConnect, 
        wsUrlChanged, 
        autoConnectChanged 
      });

      // Connect or reconnect with new URL
      connectWebSocket(sessionId, wsUrl);

      prevWsUrlRef.current = wsUrl;
      prevAutoConnectRef.current = autoConnect;
    } else if (autoConnect) {
      // Initial auto-connect
      console.log('[WebSocketManager] Initial auto-connect to:', wsUrl);
      connectWebSocket(sessionId, wsUrl);
      prevWsUrlRef.current = wsUrl;
      prevAutoConnectRef.current = autoConnect;
    }
  }, [sessionId, wsUrl, autoConnect]);

  const reconnect = useCallback(() => {
    connectWebSocket(sessionId, wsUrl);
  }, [sessionId, wsUrl]);

  return {
    isConnected,
    reconnect
  };
}
