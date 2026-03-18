export namespace GstVideoVideoTransferFunction {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const GAMMA10: 'gamma10' = 'gamma10';
  export const GAMMA18: 'gamma18' = 'gamma18';
  export const GAMMA20: 'gamma20' = 'gamma20';
  export const GAMMA22: 'gamma22' = 'gamma22';
  export const BT709: 'bt709' = 'bt709';
  export const SMPTE240M: 'smpte240m' = 'smpte240m';
  export const SRGB: 'srgb' = 'srgb';
  export const GAMMA28: 'gamma28' = 'gamma28';
  export const LOG100: 'log100' = 'log100';
  export const LOG316: 'log316' = 'log316';
  export const BT2020_12: 'bt2020_12' = 'bt2020_12';
  export const ADOBERGB: 'adobergb' = 'adobergb';
  export const BT2020_10: 'bt2020_10' = 'bt2020_10';
  export const SMPTE2084: 'smpte2084' = 'smpte2084';
  export const ARIB_STD_B67: 'arib_std_b67' = 'arib_std_b67';
  export const BT601: 'bt601' = 'bt601';
    







 
  export async function decode(func: GstVideoVideoTransferFunctionValue, val: number): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/decode`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('func', String(func));
    // Primitive parameter
    url.searchParams.append('val', String(val));
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

    







 
  export async function encode(func: GstVideoVideoTransferFunctionValue, val: number): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/encode`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('func', String(func));
    // Primitive parameter
    url.searchParams.append('val', String(val));
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

    







 
  export async function from_iso(value_: number): Promise<GstVideoVideoTransferFunctionValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/from_iso`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('value', String(value_));
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

    







 
  export async function is_equivalent(from_func: GstVideoVideoTransferFunctionValue, from_bpp: number, to_func: GstVideoVideoTransferFunctionValue, to_bpp: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/is_equivalent`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('from_func', String(from_func));
    // Primitive parameter
    url.searchParams.append('from_bpp', String(from_bpp));
    // Primitive parameter
    url.searchParams.append('to_func', String(to_func));
    // Primitive parameter
    url.searchParams.append('to_bpp', String(to_bpp));
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

    







 
  export async function to_iso(func: GstVideoVideoTransferFunctionValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/to_iso`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('func', String(func));
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

    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoTransferFunction/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoTransferFunctionValue = "unknown" | "gamma10" | "gamma18" | "gamma20" | "gamma22" | "bt709" | "smpte240m" | "srgb" | "gamma28" | "log100" | "log316" | "bt2020_12" | "adobergb" | "bt2020_10" | "smpte2084" | "arib_std_b67" | "bt601";
