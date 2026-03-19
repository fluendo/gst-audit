
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GLibDestroyNotify } from '../GLib/GLibDestroyNotify';
import { convertGLibDestroyNotifyArgs } from '../GLib/GLibDestroyNotify';
import { GstLockFlags } from './GstLockFlags';
import type { GstLockFlagsValue } from './GstLockFlags';
import type { GstMiniObjectCopyFunction } from './GstMiniObjectCopyFunction';
import { convertGstMiniObjectCopyFunctionArgs } from './GstMiniObjectCopyFunction';
import type { GstMiniObjectDisposeFunction } from './GstMiniObjectDisposeFunction';
import { convertGstMiniObjectDisposeFunctionArgs } from './GstMiniObjectDisposeFunction';
import type { GstMiniObjectFreeFunction } from './GstMiniObjectFreeFunction';
import { convertGstMiniObjectFreeFunctionArgs } from './GstMiniObjectFreeFunction';



// Finalization registry for GstMiniObject
const gstminiobjectRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/Gst/MiniObject/ptr,' + ptr + '/unref')
    .catch(err => console.error('Failed to free GstMiniObject:', ptr, err));
});

export class GstMiniObject {

  ptr!: string;

protected constructor(ptr: string, transferType: transferType) {
  this.ptr = ptr;
  // Don't register or ref in constructor - use static create() method instead
}

static async create(ptr: string, transferType: transferType): Promise<GstMiniObject> {
  const instance = new GstMiniObject(ptr, transferType);
  gstminiobjectRegistry.register(instance, ptr);
  if (transferType === 'none') {
    await instance.ref();
  }
  return instance;
}

      







 
  async unref(): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/unref`, apiConfig.baseUrl);
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
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


    







 
  async add_parent(parent: GstMiniObject, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/add_parent`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
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

    







 
  async get_qdata(quark: number): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/get_qdata`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('quark', String(quark));
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

    







 
  async is_writable(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/is_writable`, apiConfig.baseUrl);
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

    







 
  async lock(flags: GstLockFlagsValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/lock`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
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

    







 
  async remove_parent(parent: GstMiniObject, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/remove_parent`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
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

    







 
  async set_qdata(quark: number, session_id: string, callback_secret: string, destroy: GLibDestroyNotify, data_?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/set_qdata`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('quark', String(quark));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
    // Register callback using the callback handler
    let destroy_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof destroy !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      destroy_callbackInfo = callbackHandler.registerCallback(
        destroy, 
        convertGLibDestroyNotifyArgs,
        {
          methodName: 'set_qdata',
          paramName: 'destroy'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('destroy', destroy_callbackInfo.callbackUrl);
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

    







 
  async steal_qdata(quark: number): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/steal_qdata`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('quark', String(quark));
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

    







 
  async unlock(flags: GstLockFlagsValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/unlock`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
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

    







 
  static async replace(olddata?: GstMiniObject, newdata?: GstMiniObject): Promise<{olddata: GstMiniObject, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/replace`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (olddata !== undefined && typeof olddata === 'object' && 'ptr' in olddata) {
      url.searchParams.append('olddata', 'ptr,' + olddata.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (newdata !== undefined && typeof newdata === 'object' && 'ptr' in newdata) {
      url.searchParams.append('newdata', 'ptr,' + newdata.ptr);
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
        const result: any = {};
      // Handle return parameter: olddata
      result.olddata = await (async () => {
        // Return value is a struct, instantiate it from the ptr
        if (data.olddata && typeof data.olddata === 'object' && 'ptr' in data.olddata) {
        const instance = await GstMiniObject.create(data.olddata.ptr, 'none');
          return instance;
        }
        return Promise.reject("Call failed");

      })();
      // Handle return parameter: return
      result.return = await (async () => {
        return data.return;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async take(olddata: GstMiniObject, newdata: GstMiniObject): Promise<{olddata: GstMiniObject, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/take`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (olddata && typeof olddata === 'object' && 'ptr' in olddata) {
      url.searchParams.append('olddata', 'ptr,' + olddata.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (newdata && typeof newdata === 'object' && 'ptr' in newdata) {
      url.searchParams.append('newdata', 'ptr,' + newdata.ptr);
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
        const result: any = {};
      // Handle return parameter: olddata
      result.olddata = await (async () => {
        // Return value is a struct, instantiate it from the ptr
        if (data.olddata && typeof data.olddata === 'object' && 'ptr' in data.olddata) {
        const instance = await GstMiniObject.create(data.olddata.ptr, 'none');
          return instance;
        }
        return Promise.reject("Call failed");

      })();
      // Handle return parameter: return
      result.return = await (async () => {
        return data.return;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/type`, apiConfig.baseUrl);
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

    







 
  async get_refcount(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/refcount`, apiConfig.baseUrl);
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

    







 
  async get_lockstate(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/lockstate`, apiConfig.baseUrl);
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

    







 
  async get_flags(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/flags`, apiConfig.baseUrl);
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

    







 
  async get_copy(): Promise<GstMiniObjectCopyFunction | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/copy`, apiConfig.baseUrl);
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

    







 
  async get_dispose(): Promise<GstMiniObjectDisposeFunction | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/dispose`, apiConfig.baseUrl);
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

    







 
  async get_free(): Promise<GstMiniObjectFreeFunction | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/free`, apiConfig.baseUrl);
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

    







 
  async get_priv_uint(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/priv_uint`, apiConfig.baseUrl);
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

    







 
  async get_priv_pointer(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/fields/priv_pointer`, apiConfig.baseUrl);
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

    







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/get_type`, apiConfig.baseUrl);
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

    







 
  async ref(): Promise<GstMiniObject> {
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MiniObject/ptr,${this.ptr}/ref`, apiConfig.baseUrl);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // ref() should not create a new instance - it just increments the reference count
    // and returns the same object (this) to avoid infinite recursion
    return this;
		}

}

