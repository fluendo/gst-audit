export namespace GstMemoryFlags {
  export const READONLY: 'readonly' = 'readonly';
  export const NO_SHARE: 'no_share' = 'no_share';
  export const ZERO_PREFIXED: 'zero_prefixed' = 'zero_prefixed';
  export const ZERO_PADDED: 'zero_padded' = 'zero_padded';
  export const PHYSICALLY_CONTIGUOUS: 'physically_contiguous' = 'physically_contiguous';
  export const NOT_MAPPABLE: 'not_mappable' = 'not_mappable';
  export const LAST: 'last' = 'last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MemoryFlags/get_type`, apiConfig.baseUrl);
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
  export type GstMemoryFlagsValue = "readonly" | "no_share" | "zero_prefixed" | "zero_padded" | "physically_contiguous" | "not_mappable" | "last";
