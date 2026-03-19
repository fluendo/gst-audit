
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstBufferList } from './GstBufferList';
import { GstCaps } from './GstCaps';
import { GstSegment } from './GstSegment';
import { GstStructure } from './GstStructure';



// Finalization registry for GstSample
const gstsampleRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/Gst/Sample/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GstSample:', ptr, err));
});

export class GstSample {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GstSample> {
    const instance = new GstSample(ptr, transferType);
    if (transferType === 'full')
      gstsampleRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(buffer?: GstBuffer, caps?: GstCaps, segment?: GstSegment, info?: GstStructure): Promise<GstSample> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/new`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer !== undefined && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (caps !== undefined && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (segment !== undefined && typeof segment === 'object' && 'ptr' in segment) {
      url.searchParams.append('segment', 'ptr,' + segment.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (info !== undefined && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
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
const instance = await GstSample.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


      







 
  async free(): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  async get_buffer(): Promise<GstBuffer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/get_buffer`, apiConfig.baseUrl);
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
const instance = await GstBuffer.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_buffer_list(): Promise<GstBufferList | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/get_buffer_list`, apiConfig.baseUrl);
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
const instance = await GstBufferList.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_caps(): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/get_caps`, apiConfig.baseUrl);
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
const instance = await GstCaps.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_info(): Promise<GstStructure | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/get_info`, apiConfig.baseUrl);
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

    







 
  async get_segment(): Promise<GstSegment> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/get_segment`, apiConfig.baseUrl);
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
const instance = await GstSegment.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_buffer(buffer: GstBuffer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/set_buffer`, apiConfig.baseUrl);
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

    







 
  async set_buffer_list(buffer_list: GstBufferList, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/set_buffer_list`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer_list && typeof buffer_list === 'object' && 'ptr' in buffer_list) {
      url.searchParams.append('buffer_list', 'ptr,' + buffer_list.ptr);
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

    







 
  async set_caps(caps: GstCaps, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/set_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
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

    







 
  async set_info(info: GstStructure): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/set_info`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
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

    







 
  async set_segment(segment: GstSegment, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/ptr,${this.ptr}/set_segment`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (segment && typeof segment === 'object' && 'ptr' in segment) {
      url.searchParams.append('segment', 'ptr,' + segment.ptr);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Sample/get_type`, apiConfig.baseUrl);
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

