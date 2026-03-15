/**
 * GIRest Callback Handlers for gstaudit
 *
 * This file contains both client-side and server-side callback handler implementations
 * for integrating with GIRest's callback infrastructure.
 *
 * Architecture Overview:
 *
 * Client-Side Flow (Browser):
 * 1. Browser component calls GIRest API method with callback
 * 2. ClientCallbackHandler registers callback in browser memory
 * 3. Returns callback URL pointing to /api/callbacks
 * 4. gstaudit-server POSTs to callback URL
 * 5. WebSocket message sent to browser
 * 6. useCallbackRegistry hook invokes the registered callback
 *
 * Server-Side Flow (Next.js Server):
 * 1. Server code calls GIRest API method with callback
 * 2. ServerCallbackHandler registers callback in server memory
 * 3. Returns callback URL pointing to /api/callbacks/{id}
 * 4. gstaudit-server POSTs directly to callback URL
 * 5. API route executes callback immediately
 * 6. Result broadcasted to WebSocket clients if needed
 */

/**
 * Type for callback functions that can accept any number of arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallbackFunction = (...args: any[]) => void | Promise<void>;

/**
 * Type for converter functions that transform callback data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConverterFunction = (data: any) => Promise<any[]> | any[];

/**
 * Interface for callback handling
 * This matches the ICallbackHandler interface from generated bindings
 */
export interface ICallbackHandler {
  registerCallback(
    callbackFunc: CallbackFunction,
    converterFunc: ConverterFunction,
    metadata: { methodName: string; paramName: string }
  ): { callbackUrl: string; callbackId: string };
  unregisterCallback(callbackId: string): void;
}

// ============================================================================
// CLIENT-SIDE CALLBACK HANDLER (Browser)
// ============================================================================

/**
 * Client-Side Callback Handler
 *
 * Used in browser React components to make GIRest API calls with callbacks.
 * Callbacks are stored in browser memory and invoked via WebSocket messages.
 *
 * Example usage:
 * ```typescript
 * import { setCallbackHandler } from '@/lib/gst';
 * import { ClientCallbackHandler } from '@/lib/callbacks';
 *
 * // Create handler with your session ID
 * const handler = new ClientCallbackHandler({
 *   sessionId: 'my-session-123',
 *   callbackSecret: process.env.NEXT_PUBLIC_CALLBACK_SECRET!
 * });
 *
 * // Configure the generated bindings
 * setCallbackHandler(handler);
 *
 * // Now you can use callbacks
 * await Gst.some_method(
 *   sessionId,
 *   callbackSecret,
 *   (arg1, arg2) => {
 *     console.log('Callback invoked!', arg1, arg2);
 *   }
 * );
 * ```
 */
export class ClientCallbackHandler implements ICallbackHandler {
  private callbackUrl: string;
  private sessionId: string;
  private callbackSecret: string;
  private callbacks: Map<string, { func: CallbackFunction; converter: ConverterFunction }>;
  private idCounter: number;

  constructor(options: {
    callbackUrl?: string;
    sessionId: string;
    callbackSecret: string;
  }) {
    this.callbackUrl = options.callbackUrl || '/api/callbacks';
    this.sessionId = options.sessionId;
    this.callbackSecret = options.callbackSecret;
    this.callbacks = new Map();
    this.idCounter = 0;
  }

  registerCallback(
    callbackFunc: CallbackFunction,
    converterFunc: ConverterFunction,
    metadata: { methodName: string; paramName: string }
  ): { callbackUrl: string; callbackId: string } {
    // Generate unique callback ID
    const callbackId = `${metadata.methodName}_${metadata.paramName}_${++this.idCounter}_${Date.now()}`;

    // Store the callback function with its converter
    this.callbacks.set(callbackId, {
      func: callbackFunc,
      converter: converterFunc
    });

    console.log(`[Client] Registered callback: ${callbackId}`, metadata);

    // Build callback URL: /api/callbacks/{callbackId}?sessionId=xxx
    const url = new URL(`${this.callbackUrl}/${callbackId}`, window.location.origin);
    url.searchParams.set('sessionId', this.sessionId);

    return {
      callbackUrl: url.toString(),
      callbackId: callbackId
    };
  }

  unregisterCallback(callbackId: string): void {
    if (this.callbacks.delete(callbackId)) {
      console.log(`[Client] Unregistered callback: ${callbackId}`);
    } else {
      console.warn(`[Client] Callback not found: ${callbackId}`);
    }
  }

  /**
   * Get a callback registration by ID.
   * Used by useCallbackRegistry hook to execute callbacks from WebSocket messages.
   */
  getCallback(callbackId: string): { func: CallbackFunction; converter: ConverterFunction } | undefined {
    return this.callbacks.get(callbackId);
  }

  getAllCallbacks(): Map<string, { func: CallbackFunction; converter: ConverterFunction }> {
    return new Map(this.callbacks);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getCallbackSecret(): string {
    return this.callbackSecret;
  }
}

// ============================================================================
// SERVER-SIDE CALLBACK HANDLER (Next.js Server)
// ============================================================================

interface CallbackRegistration {
  func: CallbackFunction;
  converter: ConverterFunction;
  metadata: { methodName: string; paramName: string };
}

/**
 * Server-Side Callback Handler
 *
 * Used in Next.js server code (API routes, Server Components) to make GIRest
 * API calls with callbacks. Callbacks are stored in server memory and executed
 * directly when gstaudit-server POSTs to the callback URL.
 *
 * Key differences from client handler:
 * - No window.location (server-side)
 * - Uses configurable base URL
 * - Executes callbacks directly (not via WebSocket)
 * - Can broadcast results to WebSocket clients
 *
 * Example usage:
 * ```typescript
 * import { setCallbackHandler } from '@/lib/gst';
 * import { ServerCallbackHandler } from '@/lib/callbacks';
 *
 * // Create handler with connection details
 * const handler = new ServerCallbackHandler({
 *   baseUrl: 'http://localhost:3000',
 *   sessionId: 'connection-id',
 *   callbackSecret: 'secret-key'
 * });
 *
 * // Configure the generated bindings
 * setCallbackHandler(handler);
 *
 * // Register callback for GStreamer logs
 * await Gst.debug_add_log_function(
 *   sessionId,
 *   callbackSecret,
 *   async (category, level, file, func, line, obj, message) => {
 *     console.log(`LOG: ${file}:${line} - ${message}`);
 *     // Broadcast to WebSocket clients
 *     logBroadcaster.addLog(connectionId, logEntry);
 *   }
 * );
 * ```
 */
export class ServerCallbackHandler implements ICallbackHandler {
  private callbacks: Map<string, CallbackRegistration>;
  private idCounter: number;
  private baseUrl: string;
  private sessionId: string;
  private callbackSecret: string;

  constructor(options: {
    baseUrl: string; // e.g., 'http://localhost:3000'
    sessionId: string;
    callbackSecret: string;
  }) {
    this.baseUrl = options.baseUrl;
    this.sessionId = options.sessionId;
    this.callbackSecret = options.callbackSecret;
    this.callbacks = new Map();
    this.idCounter = 0;
  }

  registerCallback(
    callbackFunc: CallbackFunction,
    converterFunc: ConverterFunction,
    metadata: { methodName: string; paramName: string }
  ): { callbackUrl: string; callbackId: string } {
    // Generate unique callback ID
    const callbackId = `${metadata.methodName}_${metadata.paramName}_${++this.idCounter}_${Date.now()}`;

    // Store the callback function with converter and metadata
    this.callbacks.set(callbackId, {
      func: callbackFunc,
      converter: converterFunc,
      metadata
    });

    console.log(`[Server] Registered callback: ${callbackId}`, metadata);

    // Build callback URL pointing to Next.js API route
    const url = new URL(`/api/callbacks/${callbackId}`, this.baseUrl);

    return {
      callbackUrl: url.toString(),
      callbackId: callbackId
    };
  }

  unregisterCallback(callbackId: string): void {
    if (this.callbacks.delete(callbackId)) {
      console.log(`[Server] Unregistered callback: ${callbackId}`);
    } else {
      console.warn(`[Server] Callback not found: ${callbackId}`);
    }
  }

  /**
   * Get a callback registration by ID.
   * Used by API routes to execute callbacks.
   */
  getCallback(callbackId: string): CallbackRegistration | undefined {
    return this.callbacks.get(callbackId);
  }

  getAllCallbacks(): Map<string, CallbackRegistration> {
    return new Map(this.callbacks);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getCallbackSecret(): string {
    return this.callbackSecret;
  }

  hasCallback(callbackId: string): boolean {
    return this.callbacks.has(callbackId);
  }

  /**
   * Execute a registered callback
   *
   * This method is called by the API route when gstaudit-server POSTs
   * to the callback URL. It converts the payload using the stored
   * converter function and invokes the registered callback.
   *
   * @param callbackId The callback ID
   * @param payload The payload object from gstaudit-server with callback arguments
   * @returns The result of the callback execution
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async executeCallback(callbackId: string, payload: Record<string, any>): Promise<any> {
    const registration = this.callbacks.get(callbackId);

    if (!registration) {
      throw new Error(`Callback not found: ${callbackId}`);
    }

    console.log(`[Server] Executing callback: ${callbackId}`, registration.metadata);

    try {
      // Use the stored converter function to convert the payload to properly typed arguments
      // Converter may be async, so await it
      const args = await registration.converter(payload);

      // Call the registered callback function with converted arguments
      const result = await registration.func(...args);
      return result;
    } catch (error) {
      console.error(`[Server] Callback execution error:`, error);
      throw error;
    }
  }
}
