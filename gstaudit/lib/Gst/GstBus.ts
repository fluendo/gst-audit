
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibPollFD } from '../GLib/GLibPollFD';
import { GLibSource } from '../GLib/GLibSource';
import type { GObjectConnectFlags } from '../GObject/GObjectConnectFlags';
import type { GstBusFunc } from './GstBusFunc';
import { convertGstBusFuncArgs } from './GstBusFunc';
import type { GstBusMessageHandler } from './GstBusMessageHandler';
import { convertGstBusMessageHandlerArgs } from './GstBusMessageHandler';
import type { GstBusSyncHandler } from './GstBusSyncHandler';
import { convertGstBusSyncHandlerArgs } from './GstBusSyncHandler';
import type { GstBusSyncMessageHandler } from './GstBusSyncMessageHandler';
import { convertGstBusSyncMessageHandlerArgs } from './GstBusSyncMessageHandler';
import { GstBusSyncReply } from './GstBusSyncReply';
import type { GstBusSyncReplyValue } from './GstBusSyncReply';
import { GstMessage } from './GstMessage';
import { GstMessageType } from './GstMessageType';
import type { GstMessageTypeValue } from './GstMessageType';
import { GstObject } from './GstObject';




export class GstBus extends GstObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstBus> {
    const instance = new GstBus(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }

    







 
  static async new(): Promise<GstBus> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/new`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GstBus.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }



      







 
  async add_signal_watch(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/add_signal_watch`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async add_signal_watch_full(priority: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/add_signal_watch_full`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('priority', String(priority));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async add_watch(priority: number, session_id: string, callback_secret: string, func: GstBusFunc): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/add_watch`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('priority', String(priority));
    // Register callback using the callback handler
    let func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      func_callbackInfo = callbackHandler.registerCallback(
        func, 
        convertGstBusFuncArgs,
        {
          methodName: 'add_watch',
          paramName: 'func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('func', func_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async async_signal_func(message: GstMessage, data_?: Pointer): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/async_signal_func`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (message && typeof message === 'object' && 'ptr' in message) {
      url.searchParams.append('message', 'ptr,' + message.ptr);
    }
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async create_watch(): Promise<GLibSource | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/create_watch`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GLibSource.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async disable_sync_message_emission(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/disable_sync_message_emission`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async enable_sync_message_emission(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/enable_sync_message_emission`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_pollfd(fd: GLibPollFD, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/get_pollfd`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (fd && typeof fd === 'object' && 'ptr' in fd) {
      url.searchParams.append('fd', 'ptr,' + fd.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async have_pending(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/have_pending`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async peek(): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/peek`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async poll(events: GstMessageTypeValue, timeout: number): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/poll`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('events', String(events));
    // Primitive parameter
    url.searchParams.append('timeout', String(timeout));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async pop(): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/pop`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async pop_filtered(types: GstMessageTypeValue): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/pop_filtered`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('types', String(types));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async post(message: GstMessage): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/post`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (message && typeof message === 'object' && 'ptr' in message) {
      url.searchParams.append('message', 'ptr,' + message.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async remove_signal_watch(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/remove_signal_watch`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async remove_watch(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/remove_watch`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async set_flushing(flushing: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/set_flushing`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('flushing', String(flushing));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async set_sync_handler(session_id: string, callback_secret: string, func: GstBusSyncHandler, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/set_sync_handler`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      func_callbackInfo = callbackHandler.registerCallback(
        func, 
        convertGstBusSyncHandlerArgs,
        {
          methodName: 'set_sync_handler',
          paramName: 'func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('func', func_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async sync_signal_handler(message: GstMessage, data_?: Pointer): Promise<GstBusSyncReplyValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/sync_signal_handler`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (message && typeof message === 'object' && 'ptr' in message) {
      url.searchParams.append('message', 'ptr,' + message.ptr);
    }
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async timed_pop(timeout: number): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/timed_pop`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('timeout', String(timeout));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async timed_pop_filtered(timeout: number, types: GstMessageTypeValue): Promise<GstMessage | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/timed_pop_filtered`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('timeout', String(timeout));
    // Primitive parameter
    url.searchParams.append('types', String(types));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/get_type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      





  async connect_message(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstBusMessageHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/signals/message/connect`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }

      // Build request body
      const body: Record<string, any> = {};
      if (typeof flags !== 'undefined') {
        body['flags'] = flags;
      }
      // Register callback using the callback handler
      if (typeof handler !== 'undefined') {
        const callbackHandler = getCallbackHandler();
        if (!callbackHandler) {
          throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
        }
        
        // Register the callback with its converter function
        const handler_callbackInfo = callbackHandler.registerCallback(
          handler, 
          convertGstBusMessageHandlerArgs,
          {
            methodName: 'connect_message',
            paramName: 'handler'
          }
        );
        
        // Pass the callback URL to the server in the request body
        body['handler'] = handler_callbackInfo.callbackUrl;
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }
      





  async connect_sync_message(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstBusSyncMessageHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Bus/ptr,${this.ptr}/signals/sync-message/connect`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }

      // Build request body
      const body: Record<string, any> = {};
      if (typeof flags !== 'undefined') {
        body['flags'] = flags;
      }
      // Register callback using the callback handler
      if (typeof handler !== 'undefined') {
        const callbackHandler = getCallbackHandler();
        if (!callbackHandler) {
          throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
        }
        
        // Register the callback with its converter function
        const handler_callbackInfo = callbackHandler.registerCallback(
          handler, 
          convertGstBusSyncMessageHandlerArgs,
          {
            methodName: 'connect_sync_message',
            paramName: 'handler'
          }
        );
        
        // Pass the callback URL to the server in the request body
        body['handler'] = handler_callbackInfo.callbackUrl;
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }
}

