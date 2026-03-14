/**
 * Dynamic Callback Handler
 *
 * Receives callback invocations from gstaudit-server for specific callback IDs.
 * Handles both:
 * 1. Client-side callbacks: Broadcast via WebSocket to browser and wait for response
 * 2. Server-side callbacks: Execute directly in Next.js server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConnectionManager } from '@/lib/server/connection-manager';
import { getWebSocketManager } from '@/lib/server/websocket-handler';
import { createCallbackPromise } from '@/lib/server/callback-manager';

/**
 * POST /api/callbacks/[callbackId]?sessionId=xxx
 * Receives callback invocation from gstaudit-server
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ callbackId: string }> }
) {
  try {
    // Next.js 15: params must be awaited
    const { callbackId } = await params;

    // Get sessionId from query params (set by ClientCallbackHandler)
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    console.log(`[API] Callback: ${callbackId}, Session: ${sessionId}`);

    // Parse the callback arguments from the request body
    const args = await request.json();

    console.log(`[API] Callback args:`, JSON.stringify(args, null, 2));

    // Determine if this is a server-side or client-side callback
    // Server sessionIds start with "gstaudit-" (connection IDs)
    // Browser sessionIds are random UUIDs
    const isServerCallback = !sessionId || sessionId.startsWith('gstaudit-');

    if (!isServerCallback) {
      // CLIENT-SIDE CALLBACK: Broadcast via WebSocket to browser
      console.log(`[API] Client callback - broadcasting to session ${sessionId}`);

      const wsManager = getWebSocketManager();
      const connection = wsManager.getConnection(sessionId);

      if (!connection) {
        const allSessions = wsManager.getAllSessions();
        console.error(`[API] No WebSocket connection for session: ${sessionId}`);
        console.error(`[API] Available sessions (${allSessions.length}):`, allSessions);
        
        // Check if there are any sessions at all
        if (allSessions.length === 0) {
          console.error(`[API] NO WebSocket connections registered! Browser may not have connected yet.`);
        } else {
          console.error(`[API] Session ID mismatch. Expected: ${sessionId}, Available: ${allSessions.join(', ')}`);
        }
        
        // Return success anyway to not block girest server
        return NextResponse.json({ result: null });
      }

      // Extract the args (actual callback arguments)
      // girest/gstaudit-server sends: { sessionId, callbackName, args: {...}, invocationNumber, timestamp }
      // args is now a dict with parameter names as keys
      const callbackArgs = args.args || args;
      const invocationNumber = args.invocationNumber || 0;

      // Create unique invocation ID by combining callbackId with invocationNumber
      // This allows multiple concurrent invocations of the same callback registration
      const invocationId = `${callbackId}_${invocationNumber}`;

      // Create a promise that will be resolved when the browser sends a response
      // Uses callback-manager to avoid issues with Next.js hot-reload
      const responsePromise = createCallbackPromise(invocationId, 30000);

      // Now broadcast callback to the WebSocket client
      connection.sendMessage({
        type: 'callback',
        invocationId: invocationId,  // Use unique invocation ID
        callbackId: callbackId,       // Keep original for reference
        args: callbackArgs
      });

      console.log(`[API] Broadcast callback ${invocationId} to session ${sessionId}, waiting for response...`);

      // Wait for browser to send response back via WebSocket
      try {
        const result = await responsePromise;
        console.log(`[API] Callback ${invocationId} completed with result:`, result);
        return NextResponse.json({ return: result });
      } catch (error) {
        console.error(`[API] Callback ${invocationId} failed:`, error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
      }

    } else {
      // SERVER-SIDE CALLBACK: Execute directly
      console.log(`[API] Server callback - executing directly`);

      const manager = getConnectionManager();

      // Find which server handler registered this callback
      let handler;
      const allConnections = manager.getAllConnections();

      for (const [connId, connHandler] of allConnections) {
        if (connHandler.hasCallback(callbackId)) {
          handler = connHandler;
          break;
        }
      }

      if (!handler) {
        console.error(`[API] Callback handler not found for: ${callbackId}`);
        return NextResponse.json(
          { error: 'Callback not found' },
          { status: 404 }
        );
      }

      // Execute the callback and return the result (for sync callbacks)
      const result = await handler.executeCallback(callbackId, args);

      console.log(`[API] Server callback ${callbackId} executed with result:`, result);

      return NextResponse.json({ result });
    }

  } catch (error) {
    console.error('[API] Callback execution error:', error);
    return NextResponse.json(
      { error: 'Callback execution failed', message: String(error) },
      { status: 500 }
    );
  }
}
