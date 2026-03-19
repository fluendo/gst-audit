
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoFormat } from './GstVideoVideoFormat';
import type { GstVideoVideoFormatValue } from './GstVideoVideoFormat';



// Finalization registry for GstVideoVideoScaler
const gstvideovideoscalerRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GstVideo/VideoScaler/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GstVideoVideoScaler:', ptr, err));
});

export class GstVideoVideoScaler {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GstVideoVideoScaler> {
    const instance = new GstVideoVideoScaler(ptr, transferType);
    if (transferType === 'full')
      gstvideovideoscalerRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(): Promise<GstVideoVideoScaler> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/new`, apiConfig.baseUrl);
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
const instance = await GstVideoVideoScaler.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


      







 
  async free(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  async _2d(vscale: GstVideoVideoScaler, format: GstVideoVideoFormatValue, src_stride: number, dest_stride: number, x: number, y: number, width: number, height: number, src?: Pointer, dest?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/2d`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (vscale && typeof vscale === 'object' && 'ptr' in vscale) {
      url.searchParams.append('vscale', 'ptr,' + vscale.ptr);
    }
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    if (src !== undefined) url.searchParams.append('src', String(src));
    // Primitive parameter
    url.searchParams.append('src_stride', String(src_stride));
    // Primitive parameter
    if (dest !== undefined) url.searchParams.append('dest', String(dest));
    // Primitive parameter
    url.searchParams.append('dest_stride', String(dest_stride));
    // Primitive parameter
    url.searchParams.append('x', String(x));
    // Primitive parameter
    url.searchParams.append('y', String(y));
    // Primitive parameter
    url.searchParams.append('width', String(width));
    // Primitive parameter
    url.searchParams.append('height', String(height));
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

    







 
  async get_coeff(out_offset: number): Promise<{in_offset: number, n_taps: number, return: number}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/get_coeff`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('out_offset', String(out_offset));
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
      // Handle return parameter: in_offset
      result.in_offset = await (async () => {
        return data.in_offset;

      })();
      // Handle return parameter: n_taps
      result.n_taps = await (async () => {
        return data.n_taps;

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

    







 
  async get_max_taps(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/get_max_taps`, apiConfig.baseUrl);
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

    







 
  async horizontal(format: GstVideoVideoFormatValue, dest_offset: number, width: number, src?: Pointer, dest?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/horizontal`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    if (src !== undefined) url.searchParams.append('src', String(src));
    // Primitive parameter
    if (dest !== undefined) url.searchParams.append('dest', String(dest));
    // Primitive parameter
    url.searchParams.append('dest_offset', String(dest_offset));
    // Primitive parameter
    url.searchParams.append('width', String(width));
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

    







 
  async vertical(format: GstVideoVideoFormatValue, dest_offset: number, width: number, src_lines?: Pointer, dest?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoScaler/ptr,${this.ptr}/vertical`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    if (src_lines !== undefined) url.searchParams.append('src_lines', String(src_lines));
    // Primitive parameter
    if (dest !== undefined) url.searchParams.append('dest', String(dest));
    // Primitive parameter
    url.searchParams.append('dest_offset', String(dest_offset));
    // Primitive parameter
    url.searchParams.append('width', String(width));
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

}

