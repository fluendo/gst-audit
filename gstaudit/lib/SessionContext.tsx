'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { setApiConfig, setCallbackHandler } from '@/lib/gst';
import { ClientCallbackHandler } from '@/lib/callbacks';
import { useCallbackRegistry } from '@/hooks';

export interface ConnectionConfig {
  host: string;
  port: number;
}

interface SessionContextType {
  sessionId: string;
  callbackSecret: string;
  connection: ConnectionConfig | null;
  setConnection: (config: ConnectionConfig) => void;
  clearConnection: () => void;
  isWebSocketConnected: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

/**
 * Generate a unique session ID for this browser tab
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * SessionProvider - provides a unique sessionId for this browser tab,
 * manages the connection to a gstaudit-server, and automatically sets up
 * callback infrastructure (ClientCallbackHandler + WebSocket)
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  // Generate sessionId only on client side to avoid hydration mismatch
  const [sessionId, setSessionId] = useState<string>('');
  const [connection, setConnectionState] = useState<ConnectionConfig | null>(null);
  const callbackSecret = process.env.NEXT_PUBLIC_CALLBACK_SECRET || 'default-secret';
  const callbackHandlerRef = useRef<ClientCallbackHandler | null>(null);

  // Initialize sessionId on client side only
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      console.log(`[Session] Tab initialized with sessionId: ${newSessionId}`);
    }
  }, [sessionId]);

  // Initialize ClientCallbackHandler only when we have a connection
  useEffect(() => {
    if (connection && !callbackHandlerRef.current) {
      const handler = new ClientCallbackHandler({
        sessionId,
        callbackSecret,
      });
      callbackHandlerRef.current = handler;
      setCallbackHandler(handler);
      console.log(`[Session] Callback handler initialized for session: ${sessionId}`);
    }
  }, [connection, sessionId, callbackSecret]);

  // Configure API when connection is set
  useEffect(() => {
    if (connection) {
      console.log(`[Session] Configuring API for ${connection.host}:${connection.port}`);
      setApiConfig({ 
        host: connection.host, 
        port: connection.port, 
        basePath: '/girest' 
      });
    }
  }, [connection]);

  // Set up WebSocket connection for callbacks when connection is available
  const wsUrl = connection 
    ? `ws://localhost:3000/ws?host=${connection.host}&port=${connection.port}`
    : 'ws://localhost:3000/ws';
  
  const { isConnected: isWebSocketConnected } = useCallbackRegistry({
    sessionId,
    wsUrl,
    autoConnect: !!connection,  // Only auto-connect when we have a server connection
    onConnect: () => console.log('[Session] WebSocket connected for callbacks'),
    onDisconnect: () => console.log('[Session] WebSocket disconnected'),
    onError: (error: Error) => console.error('[Session] WebSocket error:', error),
  });

  const setConnection = (config: ConnectionConfig) => {
    console.log(`[Session] Connecting to ${config.host}:${config.port}`);
    setConnectionState(config);
  };

  const clearConnection = () => {
    console.log(`[Session] Disconnecting from server`);
    setConnectionState(null);
  };

  // Don't render children until sessionId is initialized (client-side only)
  if (!sessionId) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ 
      sessionId, 
      callbackSecret,
      connection,
      setConnection,
      clearConnection,
      isWebSocketConnected
    }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook to access the current session ID
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
