/**
 * WebSocket Hook - Shared WebSocket connection management
 *
 * Provides a single WebSocket connection per sessionId that can be shared
 * across multiple hooks (useCallbackRegistry, useBus, etc.).
 *
 * Multiple components can use this hook with the same sessionId,
 * and they will share a single WebSocket connection.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type MessageHandler = (message: WebSocketMessage) => void;

interface UseWebSocketOptions {
  sessionId: string;
  wsUrl?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: MessageHandler;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage: (message: any) => void;
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
  messageHandlers: Set<MessageHandler>;
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
      messageHandlers: new Set(),
    };

    wsInstances.set(sessionId, instance);

    if (autoConnect) {
      console.log(`[WebSocketManager] Auto-connecting to: ${wsUrl}`);
      connectWebSocket(sessionId, wsUrl);
    } else {
      console.log(`[WebSocketManager] Not auto-connecting (autoConnect=false)`);
    }
  } else {
    // Instance already exists - connect if requested and not already connected
    if (autoConnect && !instance.isConnected && (!instance.ws || instance.ws.readyState !== WebSocket.OPEN)) {
      console.log(`[WebSocketManager] Instance exists but not connected, connecting to: ${wsUrl}`);
      connectWebSocket(sessionId, wsUrl);
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
        
        // Handle common/system messages internally
        switch (message.type) {
          case 'connected':
            console.log(`[WebSocketManager] WebSocket connection established`);
            return; // Don't forward to handlers
          
          case 'registered':
            console.log(`[WebSocketManager] Session registered: ${sessionId}`);
            return; // Don't forward to handlers
          
          case 'pong':
            // Heartbeat response - no action needed
            return; // Don't forward to handlers
          
          default:
            // Forward all other messages to application handlers
            instance.messageHandlers.forEach(handler => {
              try {
                handler(message);
              } catch (error) {
                console.error(`[WebSocketManager] Error in message handler:`, error);
              }
            });
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

function addMessageHandler(sessionId: string, handler: MessageHandler) {
  const instance = wsInstances.get(sessionId);
  if (instance) {
    instance.messageHandlers.add(handler);
  }
}

function removeMessageHandler(sessionId: string, handler: MessageHandler) {
  const instance = wsInstances.get(sessionId);
  if (instance) {
    instance.messageHandlers.delete(handler);
  }
}

function sendMessage(sessionId: string, message: any) {
  const instance = wsInstances.get(sessionId);
  if (instance?.ws?.readyState === WebSocket.OPEN) {
    instance.ws.send(JSON.stringify(message));
  } else {
    console.warn(`[WebSocketManager] Cannot send message, WebSocket not connected`);
  }
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * Hook for managing a shared WebSocket connection.
 * Multiple components can use this hook with the same sessionId.
 */
export function useWebSocket(
  options: UseWebSocketOptions
): UseWebSocketReturn {
  const {
    sessionId,
    wsUrl = 'ws://localhost:3000/ws',
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const listenerRef = useRef<WebSocketListener | null>(null);
  const messageHandlerRef = useRef<MessageHandler | null>(null);

  console.log('[useWebSocket] Hook called:', { 
    sessionId, 
    wsUrl, 
    autoConnect,
    hasSessionId: !!sessionId 
  });

  // Initialize WebSocket instance
  useEffect(() => {
    console.log('!!!!! [useWebSocket] Effect running:', { sessionId, autoConnect });
    if (!sessionId) {
      console.log('!!!!! [useWebSocket] No sessionId, returning early');
      return;
    }

    const instance = getOrCreateWebSocket(sessionId, wsUrl, autoConnect);

    // Create listener object
    const listener = {
      onConnect: () => {
        setIsConnected(true);
        onConnect?.();
      },
      onDisconnect: () => {
        setIsConnected(false);
        onDisconnect?.();
      },
      onError: (error: Error) => {
        onError?.(error);
      },
    };

    listenerRef.current = listener;
    addListener(sessionId, listener);

    // Update connected state
    setIsConnected(instance.isConnected);

    return () => {
      if (listenerRef.current) {
        removeListener(sessionId, listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [sessionId, wsUrl, autoConnect, onConnect, onDisconnect, onError]);

  // Register message handler
  useEffect(() => {
    if (!sessionId || !onMessage) return;

    messageHandlerRef.current = onMessage;
    addMessageHandler(sessionId, onMessage);

    return () => {
      if (messageHandlerRef.current) {
        removeMessageHandler(sessionId, messageHandlerRef.current);
        messageHandlerRef.current = null;
      }
    };
  }, [sessionId, onMessage]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const send = useCallback((message: any) => {
    sendMessage(sessionId, message);
  }, [sessionId]);

  const reconnect = useCallback(() => {
    if (sessionId) {
      connectWebSocket(sessionId, wsUrl);
    }
  }, [sessionId, wsUrl]);

  return {
    isConnected,
    sendMessage: send,
    reconnect,
  };
}
