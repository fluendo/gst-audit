
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMeta } from '../Gst/GstMeta';
import { GstMetaInfo } from '../Gst/GstMetaInfo';
import { GstVideoAncillaryMetaField } from './GstVideoAncillaryMetaField';
import type { GstVideoAncillaryMetaFieldValue } from './GstVideoAncillaryMetaField';



// Finalization registry for GstVideoAncillaryMeta
const gstvideoancillarymetaRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GstVideo/AncillaryMeta/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GstVideoAncillaryMeta:', ptr, err));
});

export class GstVideoAncillaryMeta {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GstVideoAncillaryMeta> {
    const instance = new GstVideoAncillaryMeta(ptr, transferType);
    if (transferType === 'full')
      gstvideoancillarymetaRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(): Promise<GstVideoAncillaryMeta> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/new`, apiConfig.baseUrl);
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
const instance = await GstVideoAncillaryMeta.create(data.return.ptr, 'none');
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  static async get_info(): Promise<GstMetaInfo> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/get_info`, apiConfig.baseUrl);
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
const instance = await GstMetaInfo.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_meta(): Promise<GstMeta | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/meta`, apiConfig.baseUrl);
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
const instance = await GstMeta.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_field(): Promise<GstVideoAncillaryMetaFieldValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/field`, apiConfig.baseUrl);
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

    







 
  async get_c_not_y_channel(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/c_not_y_channel`, apiConfig.baseUrl);
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

    







 
  async get_line(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/line`, apiConfig.baseUrl);
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

    







 
  async get_offset(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/offset`, apiConfig.baseUrl);
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

    







 
  async get_DID(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/DID`, apiConfig.baseUrl);
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

    







 
  async get_SDID_block_number(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/SDID_block_number`, apiConfig.baseUrl);
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

    







 
  async get_data_count(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/data_count`, apiConfig.baseUrl);
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

    







 
  async get_data(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/data`, apiConfig.baseUrl);
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

    







 
  async get_checksum(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/AncillaryMeta/ptr,${this.ptr}/fields/checksum`, apiConfig.baseUrl);
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

