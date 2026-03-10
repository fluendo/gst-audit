/**
 * WebSocket Handler for Next.js Custom Server
 * 
 * This module manages WebSocket connections between React clients and the React server.
 * It runs in the same process as Next.js, allowing shared access to ConnectionManager,
 * LogBroadcaster, and callback handlers.
 * 
 * Architecture:
 * - React Client <--[WebSocket]--> React Server (this file)
 * - React Server <--[REST API]--> gstaudit-server (ConnectionManager)
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { getConnectionManager } from './connection-manager';
import { handleCallbackResponse } from '@/lib/server/callback-manager';

// Callback response handler is now imported from callback-manager
// This ensures it's always available regardless of API route reloads

// ============================================================================
// WebSocket Manager - Manages client WebSocket connections
// ============================================================================

export interface WebSocketConnection {
  ws: WebSocket;
  sessionId: string;
  connectionId: string; // The gstaudit-server this client is connected to
  sendMessage: (data: any) => void;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private connections: Map<string, WebSocketConnection>; // sessionId -> WebSocket connection

  private constructor() {
    this.connections = new Map();
  }

  static getInstance(): WebSocketManager {
    const globalAny = global as any;
    if (!globalAny.__webSocketManager) {
      console.log('[WebSocketManager] Creating new singleton instance');
      globalAny.__webSocketManager = new WebSocketManager();
    }
    return globalAny.__webSocketManager;
  }

  /**
   * Register a WebSocket connection for a client session
   */
  register(sessionId: string, ws: WebSocket, connectionId: string): void {
    const connection: WebSocketConnection = {
      ws,
      sessionId,
      connectionId,
      sendMessage: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    
    this.connections.set(sessionId, connection);
    console.log(`[WebSocketManager] Registered session ${sessionId} -> connection ${connectionId}`);
  }

  /**
   * Unregister a WebSocket connection
   */
  unregister(sessionId: string): void {
    this.connections.delete(sessionId);
    console.log(`[WebSocketManager] Unregistered session: ${sessionId}`);
  }

  /**
   * Get a WebSocket connection by session ID
   */
  getConnection(sessionId: string): WebSocketConnection | undefined {
    return this.connections.get(sessionId);
  }

  /**
   * Get all sessions connected to a specific gstaudit-server (connectionId)
   */
  getSessionsForConnection(connectionId: string): WebSocketConnection[] {
    const sessions: WebSocketConnection[] = [];
    for (const connection of this.connections.values()) {
      if (connection.connectionId === connectionId) {
        sessions.push(connection);
      }
    }
    return sessions;
  }

  /**
   * Get all registered session IDs (for debugging)
   */
  getAllSessions(): string[] {
    return Array.from(this.connections.keys());
  }
}

export function getWebSocketManager(): WebSocketManager {
  return WebSocketManager.getInstance();
}

// ============================================================================
// gstaudit-server Connection Initialization
// ============================================================================

/**
 * Initialize a connection to a gstaudit-server
 * This is called when the first client connects to a specific host:port
 */
async function initializeConnection(
  connectionId: string,
  host: string,
  port: number
): Promise<void> {
  const manager = getConnectionManager();
  
  // Check if already initialized
  if (manager.getHandler(connectionId)) {
    console.log(`Connection ${connectionId} already initialized`);
    return;
  }
  
  console.log(`Initializing connection to ${connectionId}...`);
  
  // Get or create handler for this connection
  const handler = manager.getOrCreateHandler(connectionId, { host, port });
  
  // Configure non-SSE bindings and register callbacks
  const { setApiConfig, setCallbackHandler } = await import('@/lib/gst');
  
  setApiConfig({ host, port, basePath: '/girest' });
  setCallbackHandler(handler);
  
  console.log(`Connection ${connectionId} initialized`);
}

// ============================================================================
// WebSocket Server Initialization
// ============================================================================

/**
 * Initialize the WebSocket server
 * Called by the custom Next.js server
 */
export function initializeWebSocketServer(wss: WebSocketServer): void {
  console.log('Setting up WebSocket connection handler...');

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    console.log('WebSocket client connected');
    
    // Parse query parameters from WebSocket URL
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');
    const host = url.searchParams.get('host');
    const port = url.searchParams.get('port');
    
    // Validate sessionId (required)
    if (!sessionId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Missing required parameter: sessionId'
      }));
      ws.close();
      return;
    }
    
    console.log(`Client ${sessionId} connecting`);
    
    // Validate host and port (required to know which gstaudit-server to connect to)
    if (!host || !port) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Missing required parameters: host and port'
      }));
      ws.close();
      return;
    }
    
    // Create connectionId from host:port (internal identifier for React server -> gstaudit-server)
    const connectionId = `gstaudit-${host}-${port}`;
    
    console.log(`Client ${sessionId} connecting to gstaudit-server at ${host}:${port} (connectionId: ${connectionId})`);
    
    // Get managers
    const connManager = getConnectionManager();
    const wsManager = getWebSocketManager();
    
    // Register the WebSocket connection
    wsManager.register(sessionId, ws, connectionId);
    console.log(`[WebSocketManager] Session ${sessionId} registered. All sessions:`, wsManager.getAllSessions());
    
    // Initialize connection to gstaudit-server if needed
    initializeConnection(connectionId, host, parseInt(port))
      .then(() => {
        console.log(`Client ${sessionId} connected to ${connectionId}`);
        
        // Acknowledge connection
        ws.send(JSON.stringify({
          type: 'connected',
          sessionId,
          connectionId
        }));
      })
      .catch((error: Error) => {
        console.error(`Failed to initialize connection ${connectionId}:`, error);
        ws.send(JSON.stringify({
          type: 'error',
          message: `Failed to connect to ${connectionId}: ${error.message}`
        }));
        ws.close();
      });
    
    // Handle incoming messages from browser
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        console.log('[WebSocket] Received message from browser:', message.type);
        
        // Handle callback response from browser
        if (message.type === 'callback-response') {
          const invocationId = message.invocationId || message.callbackId;
          console.log('[WebSocket] Callback response details:', { 
            invocationId, 
            hasInvocationId: !!message.invocationId,
            callbackId: message.callbackId,
            result: message.result
          });
          
          handleCallbackResponse(invocationId, message.result);
        }
        
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${sessionId}`);
      
      // Unregister from WebSocketManager
      const wsManager = getWebSocketManager();
      wsManager.unregister(sessionId);
      
      console.log(`Total clients remaining: ${wsManager.getSessionsForConnection(connectionId).length} for ${connectionId}`);
    });
    
    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server ready');
}
