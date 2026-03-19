export namespace GstVideoVideoColorRange {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const _0_255: '0_255' = '0_255';
  export const _16_235: '16_235' = '16_235';
    







 
  export async function offsets(range: GstVideoVideoColorRangeValue, info: GstVideoVideoFormatInfo): Promise<{offset: Array<number>, scale: Array<number>}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorRange/offsets`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('range', String(range));
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
        const result: any = {};
      // Handle return parameter: offset
      result.offset = await (async () => {
        if (data.offset && Array.isArray(data.offset)) {
          // Array of basic types - return as-is
          return data.offset;
        }
        return Promise.reject("Call failed");
      })();
      // Handle return parameter: scale
      result.scale = await (async () => {
        if (data.scale && Array.isArray(data.scale)) {
          // Array of basic types - return as-is
          return data.scale;
        }
        return Promise.reject("Call failed");
      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorRange/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoColorRangeValue = "unknown" | "0_255" | "16_235";
