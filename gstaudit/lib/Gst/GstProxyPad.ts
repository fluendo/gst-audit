
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstBufferList } from './GstBufferList';
import { GstFlowReturn } from './GstFlowReturn';
import type { GstFlowReturnValue } from './GstFlowReturn';
import { GstIterator } from './GstIterator';
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';




export class GstProxyPad extends GstPad {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstProxyPad> {
    const instance = new GstProxyPad(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }



      







 
  static async chain_default(pad: GstPad, buffer: GstBuffer, parent?: GstObject): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/chain_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pad && typeof pad === 'object' && 'ptr' in pad) {
      url.searchParams.append('pad', 'ptr,' + pad.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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

      







 
  static async chain_list_default(pad: GstPad, list: GstBufferList, parent?: GstObject): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/chain_list_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pad && typeof pad === 'object' && 'ptr' in pad) {
      url.searchParams.append('pad', 'ptr,' + pad.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (list && typeof list === 'object' && 'ptr' in list) {
      url.searchParams.append('list', 'ptr,' + list.ptr);
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

      







 
  static async getrange_default(pad: GstPad, parent: GstObject, offset: number, size: number, buffer: GstBuffer): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/getrange_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pad && typeof pad === 'object' && 'ptr' in pad) {
      url.searchParams.append('pad', 'ptr,' + pad.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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

      







 
  static async iterate_internal_links_default(pad: GstPad, parent?: GstObject): Promise<GstIterator | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/iterate_internal_links_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pad && typeof pad === 'object' && 'ptr' in pad) {
      url.searchParams.append('pad', 'ptr,' + pad.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstIterator.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_internal(): Promise<GstProxyPad | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/ptr,${this.ptr}/get_internal`, apiConfig.baseUrl);
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
        if (data.return.ptr === null) {
          return null;
        }
        // Use static factory method to properly await ref counting
const instance = await GstProxyPad.create(data.return.ptr, 'full');
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ProxyPad/get_type`, apiConfig.baseUrl);
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

}

