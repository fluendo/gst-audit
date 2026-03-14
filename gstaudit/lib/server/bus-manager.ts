/**
 * Bus Manager - Server-side bus message handling
 * 
 * Manages GStreamer bus watchers and GLib main loops.
 */

import { 
  GstElement, 
  GstBus, 
  GstBusFunc,
  GLibMainContext,
  GLibMainLoop,
  GLibThread,
  GLibThreadFunc
} from '@/lib/gst';
import { getWebSocketManager } from './websocket-handler';
import { getConnectionManager } from './connection-manager';

interface BusWatcher {
  elementPtr: string;
  busPtr: string;
  watchId: number;
  subscribers: Set<string>;
}

interface MainLoopContext {
  mainContext: GLibMainContext;
  mainLoop: GLibMainLoop;
  thread: GLibThread;
  watchers: Map<string, BusWatcher>;
}

class BusManager {
  // Track bus watch creation status per connection
  private busWatchCreated: { [connectionId: string]: boolean } = {};

  // Stub: Notify client of bus watch failure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private notifyClientOfBusWatchFailure(connectionId: string, busPtr: any) {
    // TODO: Implement actual client notification logic
    console.log(`[BusManager] Notifying client: bus watch failed for ${connectionId}, bus ${busPtr}`);
  }
  private static instance: BusManager;
  private mainLoops: Map<string, MainLoopContext>;

  private constructor() {
    this.mainLoops = new Map();
  }

  static getInstance(): BusManager {
    const globalWithManager = global as typeof global & { __busManager?: BusManager };
    if (!globalWithManager.__busManager) {
      globalWithManager.__busManager = new BusManager();
    }
    return globalWithManager.__busManager;
  }

  public async subscribe(sessionId: string, connectionId: string, elementPtr: string): Promise<void> {
    console.log(`[BusManager] Subscribe: ${sessionId}, ${connectionId}, ${elementPtr}`);
    
    // Check if we've already tried (and failed) to create a bus watch for this connection
    if (this.busWatchCreated?.[connectionId] === false) {
      console.log(`[BusManager] Bus watch creation previously failed for ${connectionId}, skipping setup`);
      throw new Error('Bus watch not available for this connection (likely gst-launch already has one)');
    }

    // If this is the first time for this connection, validate bus watch creation FIRST
    if (!this.mainLoops.has(connectionId) && !this.busWatchCreated?.[connectionId]) {
      console.log(`[BusManager] First subscription for ${connectionId}, validating bus watch...`);
      const canCreateWatch = await this.validateBusWatch(connectionId, elementPtr);
      if (!canCreateWatch) {
        console.log(`[BusManager] Cannot create bus watch for ${connectionId}, aborting setup`);
        this.busWatchCreated[connectionId] = false;
        throw new Error('Bus watch not available for this connection (likely gst-launch already has one)');
      }
      this.busWatchCreated[connectionId] = true;
    }

    // Get or create main loop context for this connection
    let context = this.mainLoops.get(connectionId);
    if (!context) {
      context = await this.createMainLoopContext(connectionId);
      this.mainLoops.set(connectionId, context);
    }

    // Check if we already have a watcher for this element
    let watcher: BusWatcher | null | undefined = context.watchers.get(elementPtr);
    
    if (watcher) {
      // Already watching this bus, just add subscriber
      watcher.subscribers.add(sessionId);
      console.log(`[BusManager] Added subscriber. Total: ${watcher.subscribers.size}`);
    } else {
      // First subscriber, create new bus watcher
      watcher = await this.createBusWatcher(connectionId, elementPtr);
      if (!watcher) {
        console.log(`[BusManager] Failed to create bus watcher for ${elementPtr}`);
        throw new Error('Failed to create bus watcher');
      }
      context.watchers.set(elementPtr, watcher);
      watcher.subscribers.add(sessionId);
      console.log(`[BusManager] Created new bus watcher`);
    }
  }

  public async unsubscribe(sessionId: string, connectionId: string, elementPtr: string): Promise<void> {
    console.log(`[BusManager] Unsubscribe: ${sessionId}, ${connectionId}, ${elementPtr}`);
    
    const context = this.mainLoops.get(connectionId);
    if (!context) {
      console.warn(`[BusManager] No main loop context for ${connectionId}`);
      return;
    }

    const watcher = context.watchers.get(elementPtr);
    if (!watcher) {
      console.warn(`[BusManager] No watcher for ${elementPtr}`);
      return;
    }

    // Remove subscriber
    watcher.subscribers.delete(sessionId);
    console.log(`[BusManager] Removed subscriber. Remaining: ${watcher.subscribers.size}`);

    // If no more subscribers, remove the watch
    if (watcher.subscribers.size === 0) {
      await this.removeBusWatcher(watcher);
      context.watchers.delete(elementPtr);
      console.log(`[BusManager] Removed bus watcher`);
    }
  }

  /**
   * Validate if we can create a bus watch for this connection.
   * This is checked BEFORE creating any GMainLoop/GThread resources.
   */
  private async validateBusWatch(connectionId: string, elementPtr: string): Promise<boolean> {
    console.log(`[BusManager] Validating bus watch for ${connectionId}, element ${elementPtr}`);
    
    try {
      // Get the element
      const element = await GstElement.create(elementPtr, 'none');
      
      // Get the bus from the element
      const bus = await element.get_bus();
      if (!bus) {
        console.error(`[BusManager] Failed to get bus from element ${elementPtr}`);
        return false;
      }
      console.log(`[BusManager] Got bus: ${bus.ptr}`);

      // Ensure the bus is not flushing
      await bus.set_flushing(false);
      
      // Try to create a watch - if this returns NULL, we can't use this bus
      const source = await bus.create_watch();
      if (!source) {
        console.log(`[BusManager] create_watch() returned NULL - bus watch not available (likely gst-launch already has one)`);
        return false;
      }
      
      // Success! We can create a watch. Clean up the test watch source.
      console.log(`[BusManager] Bus watch validation successful, source: ${source.ptr}`);
      // TODO: Should we unref the source here? For now, we'll recreate it in createBusWatcher
      
      return true;
    } catch (e) {
      console.error(`[BusManager] Error validating bus watch:`, e);
      return false;
    }
  }

  private async createMainLoopContext(connectionId: string): Promise<MainLoopContext> {
    console.log(`[BusManager] Creating GMainLoop for ${connectionId}`);

    // Get the server sessionId and secret from the ConnectionManager
    const connectionManager = getConnectionManager();
    const handler = connectionManager.getHandler(connectionId);
    if (!handler) {
      throw new Error(`No handler found for connection ${connectionId}`);
    }

    const serverSessionId = handler.getSessionId();
    const serverSecret = handler.getCallbackSecret();

    // Create a new GMainContext
    // Note: API config and callback handler are already set by ConnectionManager
    const mainContext = await GLibMainContext.new();
    console.log(`[BusManager] Created GMainContext: ${mainContext.ptr}`);

    // Create a new GMainLoop with this context
    const mainLoop = await GLibMainLoop.new(false, mainContext);
    console.log(`[BusManager] Created GMainLoop: ${mainLoop.ptr}`);

    // Thread function that will run the main loop
    // This closure captures mainLoop from the outer scope
    const threadFunc: GLibThreadFunc = async (data) => {
      console.log(`[BusManager] Thread started for ${connectionId}, running main loop ${mainLoop.ptr}`);
      
      // Run the main loop (this blocks in the audited process)
      await mainLoop.run();
      
      console.log(`[BusManager] Main loop finished for ${connectionId}`);
      return null;
    };

    // Create thread that will execute threadFunc
    // Use server sessionId and secret for proper callback routing
    const thread = await GLibThread.new(
      serverSessionId,
      serverSecret,
      threadFunc,
      `bus-mainloop-${connectionId}`
    );
    
    console.log(`[BusManager] Created GThread: ${thread.ptr}`);

    return {
      mainContext,
      mainLoop,
      thread,
      watchers: new Map()
    };
  }

  private async createBusWatcher(connectionId: string, elementPtr: string): Promise<BusWatcher | null> {
    console.log(`[BusManager] Creating bus watcher for ${elementPtr}`);

    // Get the element
    const element = await GstElement.create(elementPtr, 'none');
    
    // Get the bus from the element
    const bus = await element.get_bus();
    if (!bus) {
      throw new Error(`Failed to get bus from element ${elementPtr}`);
    }
    console.log(`[BusManager] Got bus: ${bus.ptr}`);

    // Get the main context for this connection
    const context = this.mainLoops.get(connectionId);
    if (!context) {
      throw new Error(`No main loop context for ${connectionId}`);
    }

    // Create the bus watch source (we've already validated this will work)
    console.log(`[BusManager] Creating watch source for bus ${bus.ptr}`);
    const source = await bus.create_watch();
    if (!source) {
      // This shouldn't happen since we validated, but handle it anyway
      console.error(`[BusManager] create_watch() unexpectedly returned NULL for ${connectionId}`);
      return null;
    }
    console.log(`[BusManager] Created watch source: ${source.ptr}`);

    // Set up the callback that will be invoked for each bus message
    // This closure captures elementPtr so we know which element the message is from
    const busCallback: GstBusFunc = (bus, message) => {
      console.log(`[BusManager] Bus message received for ${elementPtr}`);
      
      // Serialize the GObjects to JSON format (just pointers)
      // The converter already handled ref'ing with transfer: 'none'
      // GC will automatically unref when this callback returns
      const serializedData = {
        bus: { ptr: bus.ptr },
        message: { ptr: message.ptr },
        user_data: null
      };
      
      // Broadcast this message to all subscribers
      const watcher = context.watchers.get(elementPtr);
      if (watcher) {
        this.broadcastMessage(watcher, serializedData);
      }
      
      return true; // Keep watching
    };

    // Get the server sessionId and secret from the ConnectionManager's handler
    // This ensures callbacks are properly routed as server-side callbacks
    const connectionManager = getConnectionManager();
    const handler = connectionManager.getHandler(connectionId);
    if (!handler) {
      throw new Error(`No handler found for connection ${connectionId}`);
    }

    const serverSessionId = handler.getSessionId(); // e.g., "gstaudit-localhost-9000"
    const serverSecret = handler.getCallbackSecret();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await source.set_callback(serverSessionId, serverSecret, busCallback as any);
    console.log(`[BusManager] Set callback on source with server sessionId: ${serverSessionId}`);

    // Attach the source to our custom main context
    const sourceId = await source.attach(context.mainContext);
    console.log(`[BusManager] Attached source to main context, source ID: ${sourceId}`);

    return {
      elementPtr,
      busPtr: bus.ptr,
      watchId: sourceId,
      subscribers: new Set()
    };
  }

  private async removeBusWatcher(watcher: BusWatcher): Promise<void> {
    console.log(`[BusManager] Removing bus watcher for ${watcher.elementPtr}`);

    const bus = await GstBus.create(watcher.busPtr, 'none');
    await bus.remove_watch();
    
    console.log(`[BusManager] Removed bus watch`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private broadcastMessage(watcher: BusWatcher, messageData: any): void {
    const wsManager = getWebSocketManager();
    
    const payload = {
      type: 'bus-message',
      elementPtr: watcher.elementPtr,
      message: messageData
    };

    let broadcastCount = 0;
    for (const sessionId of watcher.subscribers) {
      const connection = wsManager.getConnection(sessionId);
      if (connection) {
        connection.sendMessage(payload);
        broadcastCount++;
      }
    }

    console.log(`[BusManager] Broadcasted to ${broadcastCount} subscribers`);
  }

  public async cleanupConnection(connectionId: string): Promise<void> {
    console.log(`[BusManager] Cleaning up ${connectionId}`);

    const context = this.mainLoops.get(connectionId);
    if (!context) return;

    // Remove all watchers
    for (const [elementPtr, watcher] of context.watchers.entries()) {
      await this.removeBusWatcher(watcher);
    }

    // TODO: Stop main loop with g_main_loop_quit

    this.mainLoops.delete(connectionId);
    console.log(`[BusManager] Cleaned up ${connectionId}`);
  }
}

export function getBusManager(): BusManager {
  return BusManager.getInstance();
}

export { BusManager };
