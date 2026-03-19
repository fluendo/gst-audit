export namespace GstDebugGraphDetails {
  export const MEDIA_TYPE: 'media_type' = 'media_type';
  export const CAPS_DETAILS: 'caps_details' = 'caps_details';
  export const NON_DEFAULT_PARAMS: 'non_default_params' = 'non_default_params';
  export const STATES: 'states' = 'states';
  export const FULL_PARAMS: 'full_params' = 'full_params';
  export const ALL: 'all' = 'all';
  export const VERBOSE: 'verbose' = 'verbose';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/DebugGraphDetails/get_type`, apiConfig.baseUrl);
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
  export type GstDebugGraphDetailsValue = "media_type" | "caps_details" | "non_default_params" | "states" | "full_params" | "all" | "verbose";
