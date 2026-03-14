/**
 * Connection Manager
 *
 * Manages connections from React Server to gstaudit-servers.
 *
 * Terminology:
 * - connectionId: Identifies a gstaudit-server (React server <-> gstaudit-server), format: "gstaudit-{host}-{port}"
 * - host/port: The gstaudit-server URL
 *
 * Multiple clients can use the same gstaudit-server connection (same connectionId).
 */

import { ServerCallbackHandler } from '@/lib/callbacks';

export interface ConnectionConfig {
  host: string;
  port: number;
  basePath?: string;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private handlers: Map<string, ServerCallbackHandler>; // connectionId -> handler (React server -> gstaudit-server)
  private configs: Map<string, ConnectionConfig>; // connectionId -> config

  private constructor() {
    this.handlers = new Map();
    this.configs = new Map();
  }

  static getInstance(): ConnectionManager {
    // Use global to ensure singleton across module contexts in Next.js
    const globalWithManager = global as typeof global & { __connectionManager?: ConnectionManager };
    if (!globalWithManager.__connectionManager) {
      console.log('[ConnectionManager] Creating new singleton instance');
      globalWithManager.__connectionManager = new ConnectionManager();
    }
    return globalWithManager.__connectionManager;
  }

  /**
   * Create a connection ID from host and port
   */
  static createConnectionId(host: string, port: number): string {
    return `gstaudit-${host}-${port}`;
  }

  // ============================================================================
  // Server-side Handler Management
  // React Server <-> gstaudit-server communication via REST API
  // ============================================================================

  /**
   * Get or create a handler for a gstaudit-server connection
   *
   * @param connectionId - Unique ID for this gstaudit-server (e.g., "gstaudit-localhost-9000")
   * @param config - Connection configuration (host, port)
   * @returns Callback handler for this connection
   */
  getOrCreateHandler(
    connectionId: string,
    config: ConnectionConfig
  ): ServerCallbackHandler {
    let handler = this.handlers.get(connectionId);

    if (!handler) {
      // Configure the API to point to this gstaudit-server
      // Note: This is global config, so it assumes single connection at a time
      // For multiple connections, we'd need per-connection API instances
      const { setApiConfig, setCallbackHandler } = require('@/lib/gst');
      setApiConfig({
        host: config.host,
        port: config.port,
        basePath: 'girest'
      });
      console.log(`[ConnectionManager] Configured API for ${config.host}:${config.port}/girest`);

      // Create new handler for this gstaudit-server connection
      handler = new ServerCallbackHandler({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        sessionId: connectionId,  // Use connectionId as the handler's identifier
        callbackSecret: process.env.CALLBACK_SECRET || 'dev-secret'
      });

      // Set the callback handler for gst.ts API calls
      // This is needed for any API calls that register callbacks (e.g., GLibThread.new())
      setCallbackHandler(handler);
      console.log(`[ConnectionManager] Set callback handler for connection: ${connectionId}`);

      this.handlers.set(connectionId, handler);
      this.configs.set(connectionId, config);

      console.log(`[ConnectionManager] Created handler for connection: ${connectionId}`);
    }

    return handler;
  }

  /**
   * Get an existing handler by connection ID
   */
  getHandler(connectionId: string): ServerCallbackHandler | undefined {
    return this.handlers.get(connectionId);
  }

  /**
   * Get connection config by connection ID
   */
  getConfig(connectionId: string): ConnectionConfig | undefined {
    return this.configs.get(connectionId);
  }

  /**
   * Remove a handler and its config
   */
  removeHandler(connectionId: string): boolean {
    this.configs.delete(connectionId);
    return this.handlers.delete(connectionId);
  }

  /**
   * Get all active connection IDs
   */
  getActiveConnections(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Get all connections (entries)
   */
  getAllConnections(): Map<string, ServerCallbackHandler> {
    return this.handlers;
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.handlers.size;
  }
}

/**
 * Get the singleton connection manager instance
 */
export function getConnectionManager(): ConnectionManager {
  return ConnectionManager.getInstance();
}

/**
 * Create a connection ID from host and port
 */
export function createConnectionId(host: string, port: number): string {
  return ConnectionManager.createConnectionId(host, port);
}
