/**
 * Log Registry Hook
 *
 * Manages log streaming from the server via WebSocket.
 * Similar architecture to useCallbackRegistry.
 *
 * Communication flow:
 * 1. Connects to WebSocket server
 * 2. Subscribes to logs on mount
 * 3. Receives 'log' messages from server
 * 4. Invokes callback for each log received
 * 5. Unsubscribes on unmount
 */

import { useCallback, useRef, useEffect } from 'react';
import { useWebSocket, WebSocketMessage } from './useWebSocket';
import { GstObject, type GstDebugLevelValue } from '@/lib/gst';

export interface LogEntry {
  timestamp: number;
  category: string;
  level: GstDebugLevelValue;
  file: string;
  function: string;
  line: number;
  object: GstObject | null; // GObject (converted from pointer, properly ref'd)
  message: string;
}

interface RawLogEntry {
  timestamp: number;
  category: string;
  level: GstDebugLevelValue;
  file: string;
  function: string;
  line: number;
  object: string | null; // Raw pointer from server
  message: string;
}

interface LogMessage extends WebSocketMessage {
  type: 'log';
  sessionId: string;
  data: RawLogEntry;
}

interface UseLogRegistryOptions {
  sessionId: string;
  callbackSecret: string;
  onLog: (log: LogEntry) => void;
  wsUrl?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface LogRegistryReturn {
  isConnected: boolean;
  reconnect: () => void;
  setCategoryLevel: (categoryPtr: string, level: GstDebugLevelValue) => void;
}

/**
 * Hook for receiving logs via WebSocket
 * 
 * This hook:
 * 1. Connects to the WebSocket server
 * 2. Subscribes to logs on mount (auto-starts logging on server)
 * 3. Listens for 'log' messages
 * 4. Invokes onLog callback for each received log
 * 5. Unsubscribes on unmount (stops logging on server)
 */
export function useLogRegistry(
  options: UseLogRegistryOptions
): LogRegistryReturn {
  const {
    sessionId,
    callbackSecret,
    onLog,
    wsUrl = 'ws://localhost:3000/ws',
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  // Use a ref to store the sendMessage function
  const sendMessageRef = useRef<((message: unknown) => void) | null>(null);

  // Handle log messages
  const handleMessage = useCallback(async (message: WebSocketMessage) => {
    // Only process 'log' messages for our connection
    if (message.type !== 'log') return;

    const logMsg = message as LogMessage;
    
    // Check if this log is for our session
    if (logMsg.sessionId !== sessionId) return;

    console.log(`[LogRegistry] Received log for session ${sessionId}:`, logMsg.data);
    
    // Convert raw log entry to proper LogEntry with GstObject
    try {
      const rawLog = logMsg.data;
      let gstObject: GstObject | null = null;
      
      // Convert pointer to GstObject if present
      if (rawLog.object) {
        gstObject = await GstObject.create(rawLog.object, 'none');
        // GC will unref automatically with transfer: 'none'
      }
      
      const logEntry: LogEntry = {
        ...rawLog,
        object: gstObject
      };
      
      // Invoke the callback with the converted log data
      onLog(logEntry);
    } catch (error) {
      console.error(`[LogRegistry] Error processing log:`, error);
    }
  }, [sessionId, onLog]);

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

  // Update the ref when ws.sendMessage changes
  useEffect(() => {
    sendMessageRef.current = ws.sendMessage;
  }, [ws.sendMessage]);

  // Subscribe to logs when connected
  useEffect(() => {
    if (!ws.isConnected || !sendMessageRef.current) return;

    console.log(`[LogRegistry] Subscribing to logs for session ${sessionId}`);
    
    // Send subscription message to server (server will auto-start logging)
    sendMessageRef.current({
      type: 'subscribe-logs',
      callbackSecret
    });

    // Cleanup: unsubscribe on unmount (server will stop logging)
    return () => {
      console.log(`[LogRegistry] Unsubscribing from logs for session ${sessionId}`);
      sendMessageRef.current?.({
        type: 'unsubscribe-logs'
      });
    };
  }, [ws.isConnected, sessionId, callbackSecret]);

  // Function to set category level
  const setCategoryLevel = useCallback((categoryPtr: string, level: GstDebugLevelValue) => {
    if (!sendMessageRef.current) {
      console.warn('[LogRegistry] Cannot set category level - not connected');
      return;
    }

    console.log(`[LogRegistry] Setting category ${categoryPtr} to level ${level}`);
    sendMessageRef.current({
      type: 'set-category-level',
      categoryPtr,
      level
    });
  }, []);

  return {
    isConnected: ws.isConnected,
    reconnect: ws.reconnect,
    setCategoryLevel,
  };
}
