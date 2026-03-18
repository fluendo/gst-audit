
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectBindingFlags } from './GObjectBindingFlags';
import type { GObjectBindingFlagsValue } from './GObjectBindingFlags';
import { GObjectClosure } from './GObjectClosure';
import { GObjectObject } from './GObjectObject';




export class GObjectBindingGroup extends GObjectObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GObjectBindingGroup> {
    const instance = new GObjectBindingGroup(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }

    







 
  static async new(): Promise<GObjectBindingGroup> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/new`, apiConfig.baseUrl);
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
const instance = await GObjectBindingGroup.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }



      







 
  async bind(source_property: string, target: GObjectObject, target_property: string, flags: GObjectBindingFlagsValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/ptr,${this.ptr}/bind`, apiConfig.baseUrl);
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

      







 
  async bind_full(source_property: string, target: GObjectObject, target_property: string, flags: GObjectBindingFlagsValue, transform_to?: GObjectClosure, transform_from?: GObjectClosure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/ptr,${this.ptr}/bind_full`, apiConfig.baseUrl);
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
    if (transform_to !== undefined && typeof transform_to === 'object' && 'ptr' in transform_to) {
      url.searchParams.append('transform_to', 'ptr,' + transform_to.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (transform_from !== undefined && typeof transform_from === 'object' && 'ptr' in transform_from) {
      url.searchParams.append('transform_from', 'ptr,' + transform_from.ptr);
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

      







 
  async dup_source(): Promise<GObjectObject | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/ptr,${this.ptr}/dup_source`, apiConfig.baseUrl);
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
const instance = await GObjectObject.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async set_source(source?: GObjectObject, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/ptr,${this.ptr}/set_source`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (source !== undefined && typeof source === 'object' && 'ptr' in source) {
      url.searchParams.append('source', 'ptr,' + source.ptr);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingGroup/get_type`, apiConfig.baseUrl);
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

