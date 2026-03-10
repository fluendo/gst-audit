/**
 * Custom Next.js Server with WebSocket Support
 *
 * This combines the Next.js HTTP server with a WebSocket server
 * on the same port, allowing them to share memory (ConnectionManager,
 * LogBroadcaster, etc.)
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create WebSocket server on the same HTTP server
  const wss = new WebSocketServer({
    server,
    path: '/ws' // WebSocket endpoint at ws://localhost:3000/ws
  });

  console.log('Initializing WebSocket handler...');

  // Use require to load the TypeScript file via tsx's loader
  // The tsx package handles TypeScript compilation on the fly
  const { initializeWebSocketServer } = require('./lib/server/websocket-handler.ts');
  initializeWebSocketServer(wss);
  console.log('WebSocket server initialized');

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket ready on ws://${hostname}:${port}/ws`);
  });
});
