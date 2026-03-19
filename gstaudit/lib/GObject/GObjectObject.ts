
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GObjectBinding } from './GObjectBinding';
import { GObjectBindingFlags } from './GObjectBindingFlags';
import type { GObjectBindingFlagsValue } from './GObjectBindingFlags';
import { GObjectClosure } from './GObjectClosure';
import type { GObjectConnectFlags } from './GObjectConnectFlags';
import type { GObjectObjectNotifyHandler } from './GObjectObjectNotifyHandler';
import { convertGObjectObjectNotifyHandlerArgs } from './GObjectObjectNotifyHandler';
import { GObjectParamSpec } from './GObjectParamSpec';
import { GObjectTypeInstance } from './GObjectTypeInstance';
import { GObjectTypeInterface } from './GObjectTypeInterface';
import { GObjectValue } from './GObjectValue';



// Finalization registry for GObjectObject
const gobjectobjectRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GObject/Object/ptr,' + ptr + '/unref')
    .catch(err => console.error('Failed to free GObjectObject:', ptr, err));
});

export class GObjectObject extends GObjectTypeInstance {


  protected constructor(ptr: string, transferType: transferType) {
  super(ptr, 'none');
    gobjectobjectRegistry.register(this, ptr);
    // Don't ref in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GObjectObject> {
    const instance = new GObjectObject(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }

    







 
  static async newv(object_type: string, parameters: Array<GObjectParameter>): Promise<GObjectObject> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/newv`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('object_type', String(object_type));
    // Primitive parameter
    url.searchParams.append('parameters', String(parameters));
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
const instance = await GObjectObject.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


      







 
  async unref(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/unref`, apiConfig.baseUrl);
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


      







 
  static async compat_control(what: number, data_?: Pointer): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/compat_control`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('what', String(what));
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

      







 
  static async interface_find_property(g_iface: GObjectTypeInterface, property_name: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/interface_find_property`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_iface && typeof g_iface === 'object' && 'ptr' in g_iface) {
      url.searchParams.append('g_iface', 'ptr,' + g_iface.ptr);
    }
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
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  static async interface_install_property(g_iface: GObjectTypeInterface, pspec: GObjectParamSpec, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/interface_install_property`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_iface && typeof g_iface === 'object' && 'ptr' in g_iface) {
      url.searchParams.append('g_iface', 'ptr,' + g_iface.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
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

      







 
  static async interface_list_properties(g_iface: GObjectTypeInterface): Promise<Array<GObjectParamSpec>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/interface_list_properties`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_iface && typeof g_iface === 'object' && 'ptr' in g_iface) {
      url.searchParams.append('g_iface', 'ptr,' + g_iface.ptr);
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
    if (data.return && Array.isArray(data.return)) {
  // Array of objects/structs - instantiate each element using async create()
  const result = await Promise.all(data.return.map(async (item: any) => {
    if (item && typeof item === 'object' && 'ptr' in item) {
      if (item.ptr === null) {
        return null;
      }
      return await GObjectParamSpec.create(item.ptr, 'none');
    }
    return item;
  }));
  return result;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async bind_property(source_property: string, target: GObjectObject, target_property: string, flags: GObjectBindingFlagsValue): Promise<GObjectBinding> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/bind_property`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('source_property', String(source_property));
    // Object with explode=false: serialize as comma-separated
    if (target && typeof target === 'object' && 'ptr' in target) {
      url.searchParams.append('target', 'ptr,' + target.ptr);
    }
    // Primitive parameter
    url.searchParams.append('target_property', String(target_property));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
// Dynamic import to avoid circular dependency with child class
        const { GObjectBinding } = await import('./GObjectBinding');
const instance = await GObjectBinding.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async bind_property_full(source_property: string, target: GObjectObject, target_property: string, flags: GObjectBindingFlagsValue, transform_to: GObjectClosure, transform_from: GObjectClosure): Promise<GObjectBinding> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/bind_property_full`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('source_property', String(source_property));
    // Object with explode=false: serialize as comma-separated
    if (target && typeof target === 'object' && 'ptr' in target) {
      url.searchParams.append('target', 'ptr,' + target.ptr);
    }
    // Primitive parameter
    url.searchParams.append('target_property', String(target_property));
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Object with explode=false: serialize as comma-separated
    if (transform_to && typeof transform_to === 'object' && 'ptr' in transform_to) {
      url.searchParams.append('transform_to', 'ptr,' + transform_to.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (transform_from && typeof transform_from === 'object' && 'ptr' in transform_from) {
      url.searchParams.append('transform_from', 'ptr,' + transform_from.ptr);
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
// Dynamic import to avoid circular dependency with child class
        const { GObjectBinding } = await import('./GObjectBinding');
const instance = await GObjectBinding.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async force_floating(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/force_floating`, apiConfig.baseUrl);
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

      







 
  async freeze_notify(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/freeze_notify`, apiConfig.baseUrl);
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

      







 
  async get_data(key: string): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/get_data`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('key', String(key));
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

      







 
  async get_property(property_name: string, value_: GObjectValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/get_property`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/get_qdata`, apiConfig.baseUrl);
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

      







 
  async getv(names: Array<string>, values: Array<GObjectValue>, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/getv`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('names', String(names));
    // Primitive parameter
    url.searchParams.append('values', String(values));
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

      







 
  async is_floating(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/is_floating`, apiConfig.baseUrl);
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

      







 
  async notify(property_name: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/notify`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
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

      







 
  async notify_by_pspec(pspec: GObjectParamSpec, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/notify_by_pspec`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
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

      







 
  async ref(): Promise<GObjectObject> {
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/ref`, apiConfig.baseUrl);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // ref() should not create a new instance - it just increments the reference count
    // and returns the same object (this) to avoid infinite recursion
    return this;
		}

      







 
  async ref_sink(): Promise<GObjectObject> {
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/ref_sink`, apiConfig.baseUrl);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // ref_sink() should not create a new instance - it just sinks the floating reference
    // and returns the same object (this) to avoid infinite recursion
    return this;
  }

      







 
  async run_dispose(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/run_dispose`, apiConfig.baseUrl);
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

      







 
  async set_data(key: string, data_?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/set_data`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('key', String(key));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

      







 
  async set_property(property_name: string, value_: GObjectValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/set_property`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

      







 
  async steal_data(key: string): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/steal_data`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('key', String(key));
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

      







 
  async steal_qdata(quark: number): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/steal_qdata`, apiConfig.baseUrl);
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

      







 
  async thaw_notify(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/thaw_notify`, apiConfig.baseUrl);
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

      







 
  async watch_closure(closure: GObjectClosure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/watch_closure`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/get_type`, apiConfig.baseUrl);
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

      





  async connect_notify(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GObjectObjectNotifyHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/Object/ptr,${this.ptr}/signals/notify/connect`, apiConfig.baseUrl);
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
          convertGObjectObjectNotifyHandlerArgs,
          {
            methodName: 'connect_notify',
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

