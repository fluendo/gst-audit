/**
 * Bus Registry Hook - Subscribe to GStreamer bus messages
 * 
 * Provides an easy way for React components to listen to bus messages
 * from GStreamer elements (pipelines, bins, etc.).
 * 
 * Uses the shared WebSocket connection (via useWebSocket) to receive
 * bus messages from the server.
 * 
 * Usage:
 *   useBusRegistry(pipeline, (message) => {
 *     console.log('Bus message:', message);
 *   });
 * 
 *   // With filtering:
 *   useBusRegistry(pipeline, handleStateChange, 'state-changed');
 *   useBusRegistry(pipeline, handleErrors, ['error', 'warning']);
 */

import { useEffect, useRef, useCallback } from 'react';
import { GstElement, GstMessage } from '@/lib/gst';
import { useSession } from '@/lib/SessionContext';
import { useWebSocket, WebSocketMessage } from './useWebSocket';

type MessageCallback = (message: GstMessage) => void;
type MessageFilter = string | string[] | undefined;

interface BusMessage extends WebSocketMessage {
  type: 'bus-message';
  elementPtr: string;
  message: any; // GstMessage
}

/**
 * Hook to subscribe to bus messages from a GStreamer element
 * 
 * @param element - The GstElement (Pipeline/Bin) to monitor
 * @param callback - Function called when matching messages arrive
 * @param filter - Optional message type(s) to filter (e.g., 'state-changed', ['error', 'warning'])
 */
export function useBusRegistry(
  element: GstElement | null,
  callback: MessageCallback,
  filter?: MessageFilter
): void {
  const callbackRef = useRef(callback);
  const filterRef = useRef(filter);
  const { sessionId } = useSession();
  const elementPtrRef = useRef<string | null>(null);

  // Keep refs up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // Handle bus messages
  const handleMessage = useCallback(async (message: WebSocketMessage) => {
    // Only process 'bus-message' messages
    if (message.type !== 'bus-message') return;

    const busMsg = message as BusMessage;
    
    // Only process messages for our element
    if (busMsg.elementPtr !== elementPtrRef.current) return;

    console.log(`[BusRegistry] Bus message for element ${busMsg.elementPtr}`);

    // Deserialize the message pointer to a typed GstMessage object
    // The message data from server is: { bus: { ptr }, message: { ptr }, user_data }
    // We create the GstMessage with transfer: 'none' (takes a ref)
    const typedMessage = await GstMessage.create(busMsg.message.message.ptr, 'none');

    // TODO: Apply filter if provided
    // For now, filtering is skipped because we need to implement message type extraction
    // This might require calling a method on GstMessage to get the type
    if (filterRef.current) {
      console.warn('[BusRegistry] Message type filtering not yet implemented');
    }

    // Call user's callback with the typed message
    callbackRef.current(typedMessage);
  }, []);

  // Use shared WebSocket with message handler
  const ws = useWebSocket({
    sessionId,
    wsUrl: 'ws://localhost:3000/ws',
    autoConnect: !!element,
    onMessage: handleMessage,
  });

  // Subscribe/unsubscribe to bus when element changes
  useEffect(() => {
    if (!element) return;
    if (!sessionId) return;
    if (!ws.isConnected) return; // Wait for WebSocket to connect

    const elementPtr = element.ptr;
    elementPtrRef.current = elementPtr;
    
    console.log(`[BusRegistry] Subscribing to bus for element ${elementPtr}`);

    // Subscribe to bus messages
    ws.sendMessage({
      type: 'subscribe-bus',
      elementPtr
    });

    // Cleanup: unsubscribe when component unmounts or element changes
    return () => {
      console.log(`[BusRegistry] Unsubscribing from bus for element ${elementPtr}`);
      
      ws.sendMessage({
        type: 'unsubscribe-bus',
        elementPtr
      });
      
      elementPtrRef.current = null;
    };
  }, [element, sessionId, ws, ws.isConnected]); // Add ws.isConnected as dependency
}
