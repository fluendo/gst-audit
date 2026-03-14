/**
 * Callback Manager - Centralized management of pending callbacks
 * 
 * This module is separate from the API route to avoid issues with Next.js
 * hot-reloading causing the handler registration to be lost.
 * 
 * Uses singleton pattern (like ConnectionManager) to ensure the Map is shared
 * across all module loads in different Next.js contexts.
 */

interface PendingCallback {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (result: any) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

class CallbackManager {
  private pendingCallbacks: Map<string, PendingCallback>;
  
  private constructor() {
    this.pendingCallbacks = new Map();
  }
  
  static getInstance(): CallbackManager {
    // Use global to ensure singleton across module contexts in Next.js
    const globalWithManager = global as typeof global & { __callbackManager?: CallbackManager };
    if (!globalWithManager.__callbackManager) {
      globalWithManager.__callbackManager = new CallbackManager();
    }
    return globalWithManager.__callbackManager;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleResponse(invocationId: string, result: any) {
    console.log(`[CallbackManager] Received callback response for ${invocationId}:`, result);
    console.log(`[CallbackManager] Pending callbacks:`, Array.from(this.pendingCallbacks.keys()));
    
    const pending = this.pendingCallbacks.get(invocationId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCallbacks.delete(invocationId);
      pending.resolve(result);
    } else {
      console.warn(`[CallbackManager] No pending callback found for ${invocationId} - may have timed out already`);
    }
  }
  
  registerCallback(
    invocationId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (result: any) => void,
    reject: (error: Error) => void,
    timeoutMs: number = 30000
  ): void {
    const timeout = setTimeout(() => {
      this.pendingCallbacks.delete(invocationId);
      reject(new Error(`Callback timeout after ${timeoutMs / 1000}s: ${invocationId}`));
    }, timeoutMs);

    this.pendingCallbacks.set(invocationId, { resolve, reject, timeout });
    console.log(`[CallbackManager] Registered pending callback ${invocationId} (total pending: ${this.pendingCallbacks.size})`);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPromise(invocationId: string, timeoutMs: number = 30000): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve, reject) => {
      this.registerCallback(invocationId, resolve, reject, timeoutMs);
    });
  }
}

// Export functions that use the singleton
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleCallbackResponse(invocationId: string, result: any) {
  CallbackManager.getInstance().handleResponse(invocationId, result);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCallbackPromise(invocationId: string, timeoutMs: number = 30000): Promise<any> {
  return CallbackManager.getInstance().createPromise(invocationId, timeoutMs);
}
