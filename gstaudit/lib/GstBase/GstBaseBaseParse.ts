
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParseFrame } from './GstBaseBaseParseFrame';
import { GstElement } from '../Gst/GstElement';
import { GstFlowReturn } from '../Gst/GstFlowReturn';
import type { GstFlowReturnValue } from '../Gst/GstFlowReturn';
import { GstFormat } from '../Gst/GstFormat';
import type { GstFormatValue } from '../Gst/GstFormat';
import { GstTagList } from '../Gst/GstTagList';
import { GstTagMergeMode } from '../Gst/GstTagMergeMode';
import type { GstTagMergeModeValue } from '../Gst/GstTagMergeMode';




export class GstBaseBaseParse extends GstElement {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstBaseBaseParse> {
    const instance = new GstBaseBaseParse(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }



      







 
  async add_index_entry(offset: number, ts: number, key: boolean, force: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/add_index_entry`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
    // Primitive parameter
    url.searchParams.append('ts', String(ts));
    // Primitive parameter
    url.searchParams.append('key', String(key));
    // Primitive parameter
    url.searchParams.append('force', String(force));
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

      







 
  async convert_default(src_format: GstFormatValue, src_value: number, dest_format: GstFormatValue): Promise<{dest_value: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/convert_default`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('src_format', String(src_format));
    // Primitive parameter
    url.searchParams.append('src_value', String(src_value));
    // Primitive parameter
    url.searchParams.append('dest_format', String(dest_format));
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
      // Handle return parameter: dest_value
      result.dest_value = await (async () => {
        return data.dest_value;

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

      







 
  async drain(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/drain`, apiConfig.baseUrl);
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

      







 
  async finish_frame(frame: GstBaseBaseParseFrame, size: number): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/finish_frame`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (frame && typeof frame === 'object' && 'ptr' in frame) {
      url.searchParams.append('frame', 'ptr,' + frame.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async merge_tags(mode: GstTagMergeModeValue, tags?: GstTagList, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/merge_tags`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (tags !== undefined && typeof tags === 'object' && 'ptr' in tags) {
      url.searchParams.append('tags', 'ptr,' + tags.ptr);
    }
    // Primitive parameter
    url.searchParams.append('mode', String(mode));
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

      







 
  async push_frame(frame: GstBaseBaseParseFrame): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/push_frame`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (frame && typeof frame === 'object' && 'ptr' in frame) {
      url.searchParams.append('frame', 'ptr,' + frame.ptr);
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

      







 
  async set_average_bitrate(bitrate: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_average_bitrate`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('bitrate', String(bitrate));
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

      







 
  async set_duration(fmt: GstFormatValue, duration: number, interval: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_duration`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fmt', String(fmt));
    // Primitive parameter
    url.searchParams.append('duration', String(duration));
    // Primitive parameter
    url.searchParams.append('interval', String(interval));
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

      







 
  async set_frame_rate(fps_num: number, fps_den: number, lead_in: number, lead_out: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_frame_rate`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_num', String(fps_num));
    // Primitive parameter
    url.searchParams.append('fps_den', String(fps_den));
    // Primitive parameter
    url.searchParams.append('lead_in', String(lead_in));
    // Primitive parameter
    url.searchParams.append('lead_out', String(lead_out));
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

      







 
  async set_has_timing_info(has_timing: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_has_timing_info`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('has_timing', String(has_timing));
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

      







 
  async set_infer_ts(infer_ts: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_infer_ts`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('infer_ts', String(infer_ts));
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

      







 
  async set_latency(min_latency: number, max_latency: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_latency`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('min_latency', String(min_latency));
    // Primitive parameter
    url.searchParams.append('max_latency', String(max_latency));
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

      







 
  async set_min_frame_size(min_size: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_min_frame_size`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('min_size', String(min_size));
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

      







 
  async set_passthrough(passthrough: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_passthrough`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('passthrough', String(passthrough));
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

      







 
  async set_pts_interpolation(pts_interpolate: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_pts_interpolation`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('pts_interpolate', String(pts_interpolate));
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

      







 
  async set_syncable(syncable: boolean, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_syncable`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('syncable', String(syncable));
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

      







 
  async set_ts_at_offset(offset: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/ptr,${this.ptr}/set_ts_at_offset`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GstBase/BaseParse/get_type`, apiConfig.baseUrl);
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

