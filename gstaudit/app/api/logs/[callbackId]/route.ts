/**
 * Log Callback Handler
 *
 * Dedicated endpoint for receiving log callbacks from gstaudit-server.
 * Uses fire-and-forget pattern - broadcasts to WebSocket immediately without waiting for response.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getWebSocketManager } from '@/lib/server/websocket-handler';

/**
 * POST /api/logs/[callbackId]?sessionId=xxx
 * Receives log callback invocation from gstaudit-server
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ callbackId: string }> }
) {
  try {
    // Next.js 15: params must be awaited
    const { callbackId } = await params;

    // Get sessionId from query params
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      console.error(`[API Log] Missing sessionId for callback ${callbackId}`);
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    console.log(`[API Log] Callback: ${callbackId}, Session: ${sessionId}`);

    // Parse the callback arguments from the request body
    const body = await request.json();

    console.log(`[API Log] Callback body:`, JSON.stringify(body, null, 2));

    // Extract the actual log data
    // gstaudit-server sends: { sessionId, callbackName, args: {...}, timestamp }
    const logData = body.args;
    if (!logData) {
      console.error(`[API Log] Missing 'args' in callback body`);
      return NextResponse.json({ error: 'Invalid log payload' }, { status: 400 });
    }

    // Get WebSocket connection and broadcast log
    const wsManager = getWebSocketManager();
    const connection = wsManager.getConnection(sessionId);
    
    if (!connection) {
      console.warn(`[API Log] No WebSocket connection for session: ${sessionId}`);
      // Return success anyway - logs are fire-and-forget
      return NextResponse.json({ success: true });
    }
    
    // Broadcast log to browser (no response expected)
    connection.sendMessage({
      type: 'log',
      sessionId: sessionId,
      data: logData
    });
    
    console.log(`[API Log] Broadcast to session ${sessionId}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[API Log] Error handling log callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
