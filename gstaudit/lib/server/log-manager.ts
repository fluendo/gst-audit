/**
 * Log Manager - Server-side log streaming manager
 * 
 * Manages GStreamer debug log streaming via gstaudit-server custom endpoints.
 * Uses async push architecture for zero-blocking performance.
 * 
 * Architecture:
 * 1. Browser requests start logging via WebSocket
 * 2. LogManager registers callback URL with gstaudit-server
 * 3. gstaudit-server extracts log strings natively in Frida
 * 4. gstaudit-server POSTs formatted logs asynchronously to Next.js
 * 5. LogManager broadcasts logs to browser via WebSocket
 * 
 * Flow:
 * Browser → Next.js WebSocket → LogManager → /gstaudit/logs/register → gstaudit-server
 *                                    ↑                                        ↓
 *                                    ←──────── Async HTTP POST ───────────────┘
 */

import type { GstDebugLevelValue } from '@/lib/gst';
import type { WebSocketConnection } from './websocket-handler';

export interface LogEntry {
  timestamp: string;  // Nanoseconds since start (as string from native)
  category: string;
  level: string;  // 'info', 'debug', etc. (from gst_debug_level_get_name)
  file: string;
  function: string;
  line: number;
  object: string | null; // Object name (already extracted from pointer)
  message: string;
}

interface LogSession {
  sessionId: string;
  connectionId: string;
  callbackSecret: string;
  callbackId: string;  // ID from gstaudit-server for unregister
  isActive: boolean;
}

/**
 * LogManager - Singleton that manages log streaming sessions
 */
class LogManager {
  private static instance: LogManager;
  private sessions: Map<string, LogSession>; // sessionId -> LogSession

  private constructor() {
    this.sessions = new Map();
  }

  static getInstance(): LogManager {
    const globalWithManager = global as typeof global & { __logManager?: LogManager };
    if (!globalWithManager.__logManager) {
      console.log('[LogManager] Creating new singleton instance');
      globalWithManager.__logManager = new LogManager();
    }
    return globalWithManager.__logManager;
  }

  /**
   * Start logging for a session
   */
  async startLogging(
    sessionId: string, 
    connectionId: string, 
    callbackSecret: string,
    wsConnection: WebSocketConnection
  ): Promise<void> {
    if (this.sessions.has(sessionId)) {
      console.log(`[LogManager] Session ${sessionId} already logging`);
      return;
    }

    console.log(`[LogManager] Starting logging for session ${sessionId}`);

    // Get gstaudit-server config from connectionId
    const { getConnectionManager } = await import('./connection-manager');
    const connManager = getConnectionManager();
    const config = connManager.getConfig(connectionId);
    
    if (!config) {
      throw new Error(`Connection config not found for ${connectionId}`);
    }
    
    const gstauditServerUrl = `http://${config.host}:${config.port}`;
    console.log(`[LogManager] Using gstaudit-server URL: ${gstauditServerUrl}`);

    // Build callback URL - use dedicated log endpoint
    // Include sessionId as query parameter (consistent with other callbacks)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/logs/${sessionId}?sessionId=${sessionId}`;

    // Register with gstaudit-server
    const response = await fetch(
      `${gstauditServerUrl}/gstaudit/GstAudit/logs/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId,
          'callback-secret': callbackSecret
        },
        body: JSON.stringify({ url: callbackUrl })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to register logs: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const callbackId = result.callbackId;

    console.log(`[LogManager] Registered callback with ID: ${callbackId}`);

    this.sessions.set(sessionId, {
      sessionId,
      connectionId,
      callbackSecret,
      callbackId,
      isActive: true
    });

    console.log(`[LogManager] Logging started for session ${sessionId}`);
  }

  /**
   * Stop logging for a session
   */
  async stopLogging(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.log(`[LogManager] Session ${sessionId} not logging`);
      return;
    }

    console.log(`[LogManager] Stopping logging for session ${sessionId}`);

    // Mark as inactive
    session.isActive = false;

    // Get gstaudit-server config from connectionId
    const { getConnectionManager } = await import('./connection-manager');
    const connManager = getConnectionManager();
    const config = connManager.getConfig(session.connectionId);
    
    if (config) {
      const gstauditServerUrl = `http://${config.host}:${config.port}`;
      
      // Unregister from gstaudit-server
      try {
        await fetch(
          `${gstauditServerUrl}/gstaudit/GstAudit/logs/unregister`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ callbackId: session.callbackId })
          }
        );
      } catch (error) {
        console.error('[LogManager] Error unregistering log callback:', error);
      }
    }

    // Cleanup
    this.sessions.delete(sessionId);

    console.log(`[LogManager] Logging stopped for session ${sessionId}`);
  }

  /**
   * Check if a session is logging
   */
  isLogging(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }
}

// Export singleton instance
export const getLogManager = () => LogManager.getInstance();
