export namespace GstVideoVideoChromaSite {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const NONE: 'none' = 'none';
  export const H_COSITED: 'h_cosited' = 'h_cosited';
  export const V_COSITED: 'v_cosited' = 'v_cosited';
  export const ALT_LINE: 'alt_line' = 'alt_line';
  export const COSITED: 'cosited' = 'cosited';
  export const JPEG: 'jpeg' = 'jpeg';
  export const MPEG2: 'mpeg2' = 'mpeg2';
  export const DV: 'dv' = 'dv';
    







 
  export async function from_string(s: string): Promise<GstVideoVideoChromaSiteValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoChromaSite/from_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('s', String(s));
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

    







 
  export async function to_string(site: GstVideoVideoChromaSiteValue): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoChromaSite/to_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('site', String(site));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoChromaSite/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoChromaSiteValue = "unknown" | "none" | "h_cosited" | "v_cosited" | "alt_line" | "cosited" | "jpeg" | "mpeg2" | "dv";
