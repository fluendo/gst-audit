
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibList } from '../GLib/GLibList';
import { GstObject } from './GstObject';
import { GstPluginDependencyFlags } from './GstPluginDependencyFlags';
import type { GstPluginDependencyFlagsValue } from './GstPluginDependencyFlags';
import type { GstPluginInitFullFunc } from './GstPluginInitFullFunc';
import { convertGstPluginInitFullFuncArgs } from './GstPluginInitFullFunc';
import type { GstPluginInitFunc } from './GstPluginInitFunc';
import { convertGstPluginInitFuncArgs } from './GstPluginInitFunc';
import { GstStructure } from './GstStructure';




export class GstPlugin extends GstObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstPlugin> {
    const instance = new GstPlugin(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }



      







 
  static async list_free(list: GLibList, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/list_free`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (list && typeof list === 'object' && 'ptr' in list) {
      url.searchParams.append('list', 'ptr,' + list.ptr);
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

      







 
  static async load_by_name(name: string): Promise<GstPlugin | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/load_by_name`, apiConfig.baseUrl);
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        if (data.return.ptr === null) {
          return null;
        }
        // Use static factory method to properly await ref counting
const instance = await GstPlugin.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  static async load_file(filename: Pointer): Promise<GstPlugin> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/load_file`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('filename', String(filename));
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
const instance = await GstPlugin.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  static async register_static(major_version: number, minor_version: number, name: string, description: string, version: string, license: string, source: string, package_: string, origin: string, session_id: string, callback_secret: string, init_func: GstPluginInitFunc): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('major_version', String(major_version));
    // Primitive parameter
    url.searchParams.append('minor_version', String(minor_version));
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    url.searchParams.append('description', String(description));
    // Primitive parameter
    url.searchParams.append('version', String(version));
    // Primitive parameter
    url.searchParams.append('license', String(license));
    // Primitive parameter
    url.searchParams.append('source', String(source));
    // Primitive parameter
    url.searchParams.append('package', String(package_));
    // Primitive parameter
    url.searchParams.append('origin', String(origin));
    // Register callback using the callback handler
    let init_func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof init_func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      init_func_callbackInfo = callbackHandler.registerCallback(
        init_func, 
        convertGstPluginInitFuncArgs,
        {
          methodName: 'register_static',
          paramName: 'init_func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('init_func', init_func_callbackInfo.callbackUrl);
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

      







 
  static async register_static_full(major_version: number, minor_version: number, name: string, description: string, version: string, license: string, source: string, package_: string, origin: string, session_id: string, callback_secret: string, init_full_func: GstPluginInitFullFunc): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/register_static_full`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('major_version', String(major_version));
    // Primitive parameter
    url.searchParams.append('minor_version', String(minor_version));
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    url.searchParams.append('description', String(description));
    // Primitive parameter
    url.searchParams.append('version', String(version));
    // Primitive parameter
    url.searchParams.append('license', String(license));
    // Primitive parameter
    url.searchParams.append('source', String(source));
    // Primitive parameter
    url.searchParams.append('package', String(package_));
    // Primitive parameter
    url.searchParams.append('origin', String(origin));
    // Register callback using the callback handler
    let init_full_func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof init_full_func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      init_full_func_callbackInfo = callbackHandler.registerCallback(
        init_full_func, 
        convertGstPluginInitFullFuncArgs,
        {
          methodName: 'register_static_full',
          paramName: 'init_full_func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('init_full_func', init_full_func_callbackInfo.callbackUrl);
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

      







 
  async add_dependency(flags: GstPluginDependencyFlagsValue, env_vars?: Array<string>, paths?: Array<string>, names?: Array<string>, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/add_dependency`, apiConfig.baseUrl);
    // Primitive parameter
    if (env_vars !== undefined) url.searchParams.append('env_vars', String(env_vars));
    // Primitive parameter
    if (paths !== undefined) url.searchParams.append('paths', String(paths));
    // Primitive parameter
    if (names !== undefined) url.searchParams.append('names', String(names));
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

      







 
  async add_dependency_simple(flags: GstPluginDependencyFlagsValue, env_vars?: string, paths?: string, names?: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/add_dependency_simple`, apiConfig.baseUrl);
    // Primitive parameter
    if (env_vars !== undefined) url.searchParams.append('env_vars', String(env_vars));
    // Primitive parameter
    if (paths !== undefined) url.searchParams.append('paths', String(paths));
    // Primitive parameter
    if (names !== undefined) url.searchParams.append('names', String(names));
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

      







 
  async add_status_error(message: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/add_status_error`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('message', String(message));
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

      







 
  async add_status_info(message: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/add_status_info`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('message', String(message));
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

      







 
  async add_status_warning(message: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/add_status_warning`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('message', String(message));
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

      







 
  async get_cache_data(): Promise<GstStructure | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_cache_data`, apiConfig.baseUrl);
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
const instance = await GstStructure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_description(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_description`, apiConfig.baseUrl);
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

      







 
  async get_filename(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_filename`, apiConfig.baseUrl);
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

      







 
  async get_license(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_license`, apiConfig.baseUrl);
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

      







 
  async get_name_2(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_name`, apiConfig.baseUrl);
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

      







 
  async get_origin(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_origin`, apiConfig.baseUrl);
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

      







 
  async get_package(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_package`, apiConfig.baseUrl);
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

      







 
  async get_release_date_string(): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_release_date_string`, apiConfig.baseUrl);
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

      







 
  async get_source(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_source`, apiConfig.baseUrl);
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

      







 
  async get_status_errors(): Promise<Array<string> | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_status_errors`, apiConfig.baseUrl);
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
    if (data.return && Array.isArray(data.return)) {
  if (data.return === null) {
    return null;
  }
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_status_infos(): Promise<Array<string> | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_status_infos`, apiConfig.baseUrl);
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
    if (data.return && Array.isArray(data.return)) {
  if (data.return === null) {
    return null;
  }
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_status_warnings(): Promise<Array<string> | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_status_warnings`, apiConfig.baseUrl);
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
    if (data.return && Array.isArray(data.return)) {
  if (data.return === null) {
    return null;
  }
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_version(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/get_version`, apiConfig.baseUrl);
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

      







 
  async is_loaded(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/is_loaded`, apiConfig.baseUrl);
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

      







 
  async load(): Promise<GstPlugin | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/load`, apiConfig.baseUrl);
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
const instance = await GstPlugin.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async set_cache_data(cache_data: GstStructure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/ptr,${this.ptr}/set_cache_data`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (cache_data && typeof cache_data === 'object' && 'ptr' in cache_data) {
      url.searchParams.append('cache_data', 'ptr,' + cache_data.ptr);
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

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Plugin/get_type`, apiConfig.baseUrl);
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

