
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibDateTime } from '../GLib/GLibDateTime';
import { GstVideoVideoTimeCodeConfig } from './GstVideoVideoTimeCodeConfig';
import { GstVideoVideoTimeCodeFlags } from './GstVideoVideoTimeCodeFlags';
import type { GstVideoVideoTimeCodeFlagsValue } from './GstVideoVideoTimeCodeFlags';
import { GstVideoVideoTimeCodeInterval } from './GstVideoVideoTimeCodeInterval';



// Finalization registry for GstVideoVideoTimeCode
const gstvideovideotimecodeRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GstVideo/VideoTimeCode/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GstVideoVideoTimeCode:', ptr, err));
});

export class GstVideoVideoTimeCode {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GstVideoVideoTimeCode> {
    const instance = new GstVideoVideoTimeCode(ptr, transferType);
    if (transferType === 'full')
      gstvideovideotimecodeRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(fps_n: number, fps_d: number, latest_daily_jam: GLibDateTime, flags: GstVideoVideoTimeCodeFlagsValue, hours: number, minutes: number, seconds: number, frames: number, field_count: number): Promise<GstVideoVideoTimeCode> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/new`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (latest_daily_jam && typeof latest_daily_jam === 'object' && 'ptr' in latest_daily_jam) {
      url.searchParams.append('latest_daily_jam', 'ptr,' + latest_daily_jam.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('hours', String(hours));
    // Primitive parameter
    url.searchParams.append('minutes', String(minutes));
    // Primitive parameter
    url.searchParams.append('seconds', String(seconds));
    // Primitive parameter
    url.searchParams.append('frames', String(frames));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_empty(): Promise<GstVideoVideoTimeCode> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/new_empty`, apiConfig.baseUrl);
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_from_date_time(fps_n: number, fps_d: number, dt: GLibDateTime, flags: GstVideoVideoTimeCodeFlagsValue, field_count: number): Promise<GstVideoVideoTimeCode> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/new_from_date_time`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (dt && typeof dt === 'object' && 'ptr' in dt) {
      url.searchParams.append('dt', 'ptr,' + dt.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_from_date_time_full(fps_n: number, fps_d: number, dt: GLibDateTime, flags: GstVideoVideoTimeCodeFlagsValue, field_count: number): Promise<GstVideoVideoTimeCode | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/new_from_date_time_full`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (dt && typeof dt === 'object' && 'ptr' in dt) {
      url.searchParams.append('dt', 'ptr,' + dt.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_from_string(tc_str: string): Promise<GstVideoVideoTimeCode | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/new_from_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('tc_str', String(tc_str));
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  async add_frames(frames: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/add_frames`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('frames', String(frames));
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

    







 
  async add_interval(tc_inter: GstVideoVideoTimeCodeInterval): Promise<GstVideoVideoTimeCode | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/add_interval`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (tc_inter && typeof tc_inter === 'object' && 'ptr' in tc_inter) {
      url.searchParams.append('tc_inter', 'ptr,' + tc_inter.ptr);
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
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async clear(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/clear`, apiConfig.baseUrl);
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

    







 
  async compare(tc2: GstVideoVideoTimeCode): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/compare`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (tc2 && typeof tc2 === 'object' && 'ptr' in tc2) {
      url.searchParams.append('tc2', 'ptr,' + tc2.ptr);
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

    







 
  async copy(): Promise<GstVideoVideoTimeCode> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/copy`, apiConfig.baseUrl);
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
const instance = await GstVideoVideoTimeCode.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async frames_since_daily_jam(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/frames_since_daily_jam`, apiConfig.baseUrl);
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

    







 
  async increment_frame(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/increment_frame`, apiConfig.baseUrl);
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

    







 
  async init(fps_n: number, fps_d: number, flags: GstVideoVideoTimeCodeFlagsValue, hours: number, minutes: number, seconds: number, frames: number, field_count: number, latest_daily_jam?: GLibDateTime, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/init`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (latest_daily_jam !== undefined && typeof latest_daily_jam === 'object' && 'ptr' in latest_daily_jam) {
      url.searchParams.append('latest_daily_jam', 'ptr,' + latest_daily_jam.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('hours', String(hours));
    // Primitive parameter
    url.searchParams.append('minutes', String(minutes));
    // Primitive parameter
    url.searchParams.append('seconds', String(seconds));
    // Primitive parameter
    url.searchParams.append('frames', String(frames));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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

    







 
  async init_from_date_time(fps_n: number, fps_d: number, dt: GLibDateTime, flags: GstVideoVideoTimeCodeFlagsValue, field_count: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/init_from_date_time`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (dt && typeof dt === 'object' && 'ptr' in dt) {
      url.searchParams.append('dt', 'ptr,' + dt.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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

    







 
  async init_from_date_time_full(fps_n: number, fps_d: number, dt: GLibDateTime, flags: GstVideoVideoTimeCodeFlagsValue, field_count: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/init_from_date_time_full`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('fps_n', String(fps_n));
    // Primitive parameter
    url.searchParams.append('fps_d', String(fps_d));
    // Object with explode=false: serialize as comma-separated
    if (dt && typeof dt === 'object' && 'ptr' in dt) {
      url.searchParams.append('dt', 'ptr,' + dt.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
    // Primitive parameter
    url.searchParams.append('field_count', String(field_count));
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

    







 
  async is_valid(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/is_valid`, apiConfig.baseUrl);
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

    







 
  async nsec_since_daily_jam(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/nsec_since_daily_jam`, apiConfig.baseUrl);
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

    







 
  async to_date_time(): Promise<GLibDateTime | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/to_date_time`, apiConfig.baseUrl);
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
const instance = await GLibDateTime.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async to_string(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/to_string`, apiConfig.baseUrl);
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

    







 
  async get_config(): Promise<GstVideoVideoTimeCodeConfig | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/config`, apiConfig.baseUrl);
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
const instance = await GstVideoVideoTimeCodeConfig.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_hours(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/hours`, apiConfig.baseUrl);
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

    







 
  async get_minutes(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/minutes`, apiConfig.baseUrl);
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

    







 
  async get_seconds(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/seconds`, apiConfig.baseUrl);
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

    







 
  async get_frames(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/frames`, apiConfig.baseUrl);
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

    







 
  async get_field_count(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/ptr,${this.ptr}/fields/field_count`, apiConfig.baseUrl);
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

    







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTimeCode/get_type`, apiConfig.baseUrl);
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

