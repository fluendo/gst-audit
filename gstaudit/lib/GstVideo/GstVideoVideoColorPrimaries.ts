export namespace GstVideoVideoColorPrimaries {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const BT709: 'bt709' = 'bt709';
  export const BT470M: 'bt470m' = 'bt470m';
  export const BT470BG: 'bt470bg' = 'bt470bg';
  export const SMPTE170M: 'smpte170m' = 'smpte170m';
  export const SMPTE240M: 'smpte240m' = 'smpte240m';
  export const FILM: 'film' = 'film';
  export const BT2020: 'bt2020' = 'bt2020';
  export const ADOBERGB: 'adobergb' = 'adobergb';
  export const SMPTEST428: 'smptest428' = 'smptest428';
  export const SMPTERP431: 'smpterp431' = 'smpterp431';
  export const SMPTEEG432: 'smpteeg432' = 'smpteeg432';
  export const EBU3213: 'ebu3213' = 'ebu3213';
    







 
  export async function from_iso(value_: number): Promise<GstVideoVideoColorPrimariesValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorPrimaries/from_iso`, apiConfig.baseUrl);
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

    







 
  export async function get_info(primaries: GstVideoVideoColorPrimariesValue): Promise<GstVideoVideoColorPrimariesInfo> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorPrimaries/get_info`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('primaries', String(primaries));
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
const instance = await GstVideoVideoColorPrimariesInfo.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  export async function is_equivalent(primaries: GstVideoVideoColorPrimariesValue, other: GstVideoVideoColorPrimariesValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorPrimaries/is_equivalent`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('primaries', String(primaries));
    // Primitive parameter
    url.searchParams.append('other', String(other));
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

    







 
  export async function to_iso(primaries: GstVideoVideoColorPrimariesValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorPrimaries/to_iso`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('primaries', String(primaries));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorPrimaries/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoColorPrimariesValue = "unknown" | "bt709" | "bt470m" | "bt470bg" | "smpte170m" | "smpte240m" | "film" | "bt2020" | "adobergb" | "smptest428" | "smpterp431" | "smpteeg432" | "ebu3213";
