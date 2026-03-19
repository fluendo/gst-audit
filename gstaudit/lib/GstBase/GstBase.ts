
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibList } from '../GLib/GLibList';
import type { GstBaseTypeFindHelperGetRangeFunction } from './GstBaseTypeFindHelperGetRangeFunction';
import { convertGstBaseTypeFindHelperGetRangeFunctionArgs } from './GstBaseTypeFindHelperGetRangeFunction';
import { GstBuffer } from '../Gst/GstBuffer';
import { GstCaps } from '../Gst/GstCaps';
import { GstFlowReturn } from '../Gst/GstFlowReturn';
import type { GstFlowReturnValue } from '../Gst/GstFlowReturn';
import { GstObject } from '../Gst/GstObject';
import { GstPad } from '../Gst/GstPad';
import { GstTypeFindProbability } from '../Gst/GstTypeFindProbability';
import type { GstTypeFindProbabilityValue } from '../Gst/GstTypeFindProbability';



export namespace GstBase {
  







 
  export async function type_find_helper(src: GstPad, size: number): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('size', String(size));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_buffer(buf: GstBuffer, prob: GstTypeFindProbabilityValue, obj?: GstObject): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_buffer`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (buf && typeof buf === 'object' && 'ptr' in buf) {
      url.searchParams.append('buf', 'ptr,' + buf.ptr);
    }
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_buffer_with_caps(buf: GstBuffer, caps: GstCaps, prob: GstTypeFindProbabilityValue, obj?: GstObject): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_buffer_with_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (buf && typeof buf === 'object' && 'ptr' in buf) {
      url.searchParams.append('buf', 'ptr,' + buf.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_buffer_with_extension(buf: GstBuffer, prob: GstTypeFindProbabilityValue, obj?: GstObject, extension?: string): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_buffer_with_extension`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (buf && typeof buf === 'object' && 'ptr' in buf) {
      url.searchParams.append('buf', 'ptr,' + buf.ptr);
    }
    // Primitive parameter
    if (extension !== undefined) url.searchParams.append('extension', String(extension));
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_data(data_: Array<number>, prob: GstTypeFindProbabilityValue, obj?: GstObject): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_data`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Primitive parameter
    url.searchParams.append('data', String(data_));
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_data_with_caps(data_: Array<number>, caps: GstCaps, prob: GstTypeFindProbabilityValue, obj?: GstObject): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_data_with_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Primitive parameter
    url.searchParams.append('data', String(data_));
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_data_with_extension(data_: Array<number>, prob: GstTypeFindProbabilityValue, obj?: GstObject, extension?: string): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_data_with_extension`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Primitive parameter
    url.searchParams.append('data', String(data_));
    // Primitive parameter
    if (extension !== undefined) url.searchParams.append('extension', String(extension));
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_for_extension(extension: string, obj?: GstObject): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_for_extension`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Primitive parameter
    url.searchParams.append('extension', String(extension));
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_get_range(obj: GstObject, size: number, prob: GstTypeFindProbabilityValue, session_id: string, callback_secret: string, func: GstBaseTypeFindHelperGetRangeFunction, parent?: GstObject, extension?: string): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_get_range`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Primitive parameter
    if (extension !== undefined) url.searchParams.append('extension', String(extension));
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
        convertGstBaseTypeFindHelperGetRangeFunctionArgs,
        {
          methodName: 'type_find_helper_get_range',
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_find_helper_get_range_full(obj: GstObject, size: number, caps: GstCaps, prob: GstTypeFindProbabilityValue, session_id: string, callback_secret: string, func: GstBaseTypeFindHelperGetRangeFunction, parent?: GstObject, extension?: string): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_helper_get_range_full`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Primitive parameter
    if (extension !== undefined) url.searchParams.append('extension', String(extension));
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Primitive parameter
    url.searchParams.append('prob', String(prob));
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
        convertGstBaseTypeFindHelperGetRangeFunctionArgs,
        {
          methodName: 'type_find_helper_get_range_full',
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

  







 
  export async function type_find_list_factories_for_caps(caps: GstCaps, obj?: GstObject): Promise<GLibList | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/type_find_list_factories_for_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (obj !== undefined && typeof obj === 'object' && 'ptr' in obj) {
      url.searchParams.append('obj', 'ptr,' + obj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
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
    // Return value is a List, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
  const instance = await GLibList.create(data.return.ptr, 'full', GstTypeFindFactory, undefined);
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

}

