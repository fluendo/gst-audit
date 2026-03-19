
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibList } from '../GLib/GLibList';
import type { GObjectConnectFlags } from '../GObject/GObjectConnectFlags';
import { GObjectInitiallyUnowned } from '../GObject/GObjectInitiallyUnowned';
import { GObjectObject } from '../GObject/GObjectObject';
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GObjectValue } from '../GObject/GObjectValue';
import type { GstControlBinding } from './GstControlBinding';
import type { GstObjectDeepNotifyHandler } from './GstObjectDeepNotifyHandler';
import { convertGstObjectDeepNotifyHandlerArgs } from './GstObjectDeepNotifyHandler';




export class GstObject extends GObjectInitiallyUnowned {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstObject> {
    const instance = new GstObject(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }


      







 
  async unref_2(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/unref`, apiConfig.baseUrl);
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


      







 
  static async check_uniqueness(list: GLibList, name: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/check_uniqueness`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (list && typeof list === 'object' && 'ptr' in list) {
      url.searchParams.append('list', 'ptr,' + list.ptr);
    }
    // Primitive parameter
    url.searchParams.append('name', String(name));
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

      







 
  static async default_deep_notify(object: GObjectObject, orig: GstObject, pspec: GObjectParamSpec, excluded_props?: Array<string>, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/default_deep_notify`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (object && typeof object === 'object' && 'ptr' in object) {
      url.searchParams.append('object', 'ptr,' + object.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (orig && typeof orig === 'object' && 'ptr' in orig) {
      url.searchParams.append('orig', 'ptr,' + orig.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Primitive parameter
    if (excluded_props !== undefined) url.searchParams.append('excluded_props', String(excluded_props));
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

      







 
  static async replace(oldobj?: GstObject, newobj?: GstObject): Promise<{oldobj: GstObject, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    if (oldobj && typeof oldobj === 'object' && 'ptr' in oldobj) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + oldobj.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/replace`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (oldobj !== undefined && typeof oldobj === 'object' && 'ptr' in oldobj) {
      url.searchParams.append('oldobj', 'ptr,' + oldobj.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (newobj !== undefined && typeof newobj === 'object' && 'ptr' in newobj) {
      url.searchParams.append('newobj', 'ptr,' + newobj.ptr);
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
        if (oldobj && typeof oldobj === 'object' && 'ptr' in oldobj) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + oldobj.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: oldobj
      result.oldobj = await (async () => {
              // Return value is an object, instantiate it from the ptr
              if (data.oldobj && typeof data.oldobj === 'object' && 'ptr' in data.oldobj) {
                // Use static factory method to properly await ref counting
        const instance = await GstObject.create(data.oldobj.ptr, 'none');
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
        if (oldobj && typeof oldobj === 'object' && 'ptr' in oldobj) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + oldobj.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

      







 
  async add_control_binding(binding: GstControlBinding): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/add_control_binding`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (binding && typeof binding === 'object' && 'ptr' in binding) {
      url.searchParams.append('binding', 'ptr,' + binding.ptr);
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

      







 
  async default_error(error_: Pointer, debug?: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/default_error`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    if (debug !== undefined) url.searchParams.append('debug', String(debug));
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

      







 
  async get_control_binding(property_name: string): Promise<GstControlBinding | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_control_binding`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
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
// Dynamic import to avoid circular dependency with child class
        const { GstControlBinding } = await import('./GstControlBinding');
const instance = await GstControlBinding.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_control_rate(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_control_rate`, apiConfig.baseUrl);
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

      







 
  async get_g_value_array(property_name: string, timestamp: number, interval: number, values: Array<GObjectValue>): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_g_value_array`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Primitive parameter
    url.searchParams.append('timestamp', String(timestamp));
    // Primitive parameter
    url.searchParams.append('interval', String(interval));
    // Primitive parameter
    url.searchParams.append('values', String(values));
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

      







 
  async get_name(): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_name`, apiConfig.baseUrl);
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

      







 
  async get_parent(): Promise<GstObject | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_parent`, apiConfig.baseUrl);
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
const instance = await GstObject.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_path_string(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_path_string`, apiConfig.baseUrl);
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

      







 
  async get_value(property_name: string, timestamp: number): Promise<GObjectValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/get_value`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Primitive parameter
    url.searchParams.append('timestamp', String(timestamp));
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
const instance = await GObjectValue.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async has_active_control_bindings(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/has_active_control_bindings`, apiConfig.baseUrl);
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

      







 
  async has_ancestor(ancestor: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/has_ancestor`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (ancestor && typeof ancestor === 'object' && 'ptr' in ancestor) {
      url.searchParams.append('ancestor', 'ptr,' + ancestor.ptr);
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

      







 
  async has_as_ancestor(ancestor: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/has_as_ancestor`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (ancestor && typeof ancestor === 'object' && 'ptr' in ancestor) {
      url.searchParams.append('ancestor', 'ptr,' + ancestor.ptr);
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

      







 
  async has_as_parent(parent: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/has_as_parent`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async ref_2(): Promise<GstObject> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/ref`, apiConfig.baseUrl);
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
const instance = await GstObject.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async remove_control_binding(binding: GstControlBinding): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/remove_control_binding`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (binding && typeof binding === 'object' && 'ptr' in binding) {
      url.searchParams.append('binding', 'ptr,' + binding.ptr);
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

      







 
  async set_control_binding_disabled(property_name: string, disabled: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/set_control_binding_disabled`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Primitive parameter
    url.searchParams.append('disabled', String(disabled));
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

      







 
  async set_control_bindings_disabled(disabled: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/set_control_bindings_disabled`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('disabled', String(disabled));
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

      







 
  async set_control_rate(control_rate: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/set_control_rate`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('control_rate', String(control_rate));
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

      







 
  async set_name(name?: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/set_name`, apiConfig.baseUrl);
    // Primitive parameter
    if (name !== undefined) url.searchParams.append('name', String(name));
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

      







 
  async set_parent(parent: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/set_parent`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async suggest_next_sync(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/suggest_next_sync`, apiConfig.baseUrl);
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

      







 
  async sync_values(timestamp: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/sync_values`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('timestamp', String(timestamp));
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

      







 
  async unparent(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/unparent`, apiConfig.baseUrl);
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

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/get_type`, apiConfig.baseUrl);
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

      





  async connect_deep_notify(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstObjectDeepNotifyHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Object/ptr,${this.ptr}/signals/deep-notify/connect`, apiConfig.baseUrl);
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
          convertGstObjectDeepNotifyHandlerArgs,
          {
            methodName: 'connect_deep_notify',
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

