
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstAllocationParams } from './GstAllocationParams';
import { GstAllocator } from './GstAllocator';
import { GstBuffer } from './GstBuffer';
import { GstBufferPoolAcquireParams } from './GstBufferPoolAcquireParams';
import { GstCaps } from './GstCaps';
import { GstFlowReturn } from './GstFlowReturn';
import type { GstFlowReturnValue } from './GstFlowReturn';
import { GstObject } from './GstObject';
import { GstStructure } from './GstStructure';




export class GstBufferPool extends GstObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstBufferPool> {
    const instance = new GstBufferPool(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }

    







 
  static async new(): Promise<GstBufferPool> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/new`, apiConfig.baseUrl);
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
const instance = await GstBufferPool.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }



      







 
  static async config_add_option(config: GstStructure, option: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_add_option`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Primitive parameter
    url.searchParams.append('option', String(option));
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

      







 
  static async config_get_allocator(config: GstStructure, params: GstAllocationParams, allocator?: GstAllocator): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_get_allocator`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (allocator !== undefined && typeof allocator === 'object' && 'ptr' in allocator) {
      url.searchParams.append('allocator', 'ptr,' + allocator.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (params && typeof params === 'object' && 'ptr' in params) {
      url.searchParams.append('params', 'ptr,' + params.ptr);
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

      







 
  static async config_get_option(config: GstStructure, index: number): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_get_option`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Primitive parameter
    url.searchParams.append('index', String(index));
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

      







 
  static async config_get_params(config: GstStructure, caps?: GstCaps): Promise<{size: number, min_buffers: number, max_buffers: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_get_params`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps !== undefined && typeof caps === 'object' && 'ptr' in caps) {
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
        const result: any = {};
      // Handle return parameter: size
      result.size = await (async () => {
        return data.size;

      })();
      // Handle return parameter: min_buffers
      result.min_buffers = await (async () => {
        return data.min_buffers;

      })();
      // Handle return parameter: max_buffers
      result.max_buffers = await (async () => {
        return data.max_buffers;

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

      







 
  static async config_has_option(config: GstStructure, option: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_has_option`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Primitive parameter
    url.searchParams.append('option', String(option));
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

      







 
  static async config_n_options(config: GstStructure): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_n_options`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
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

      







 
  static async config_set_allocator(config: GstStructure, allocator?: GstAllocator, params?: GstAllocationParams, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_set_allocator`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (allocator !== undefined && typeof allocator === 'object' && 'ptr' in allocator) {
      url.searchParams.append('allocator', 'ptr,' + allocator.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (params !== undefined && typeof params === 'object' && 'ptr' in params) {
      url.searchParams.append('params', 'ptr,' + params.ptr);
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

      







 
  static async config_set_params(config: GstStructure, size: number, min_buffers: number, max_buffers: number, caps?: GstCaps, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_set_params`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps !== undefined && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Primitive parameter
    url.searchParams.append('min_buffers', String(min_buffers));
    // Primitive parameter
    url.searchParams.append('max_buffers', String(max_buffers));
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

      







 
  static async config_validate_params(config: GstStructure, size: number, min_buffers: number, max_buffers: number, caps?: GstCaps): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/config_validate_params`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps !== undefined && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Primitive parameter
    url.searchParams.append('min_buffers', String(min_buffers));
    // Primitive parameter
    url.searchParams.append('max_buffers', String(max_buffers));
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

      







 
  async acquire_buffer(buffer?: GstBuffer, params?: GstBufferPoolAcquireParams): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/acquire_buffer`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer !== undefined && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (params !== undefined && typeof params === 'object' && 'ptr' in params) {
      url.searchParams.append('params', 'ptr,' + params.ptr);
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

      







 
  async get_config(): Promise<GstStructure> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/get_config`, apiConfig.baseUrl);
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
const instance = await GstStructure.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_options(): Promise<Array<string>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/get_options`, apiConfig.baseUrl);
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
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async has_option(option: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/has_option`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('option', String(option));
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

      







 
  async is_active(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/is_active`, apiConfig.baseUrl);
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

      







 
  async release_buffer(buffer: GstBuffer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/release_buffer`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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

      







 
  async set_active(active: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/set_active`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('active', String(active));
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

      







 
  async set_config(config: GstStructure): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/set_config`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (config && typeof config === 'object' && 'ptr' in config) {
      url.searchParams.append('config', 'ptr,' + config.ptr);
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

      







 
  async set_flushing(flushing: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/ptr,${this.ptr}/set_flushing`, apiConfig.baseUrl);
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

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferPool/get_type`, apiConfig.baseUrl);
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

