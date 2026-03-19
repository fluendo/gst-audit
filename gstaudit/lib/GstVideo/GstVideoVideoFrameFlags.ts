export namespace GstVideoVideoFrameFlags {
  export const NONE: 'none' = 'none';
  export const INTERLACED: 'interlaced' = 'interlaced';
  export const TFF: 'tff' = 'tff';
  export const RFF: 'rff' = 'rff';
  export const ONEFIELD: 'onefield' = 'onefield';
  export const MULTIPLE_VIEW: 'multiple_view' = 'multiple_view';
  export const FIRST_IN_BUNDLE: 'first_in_bundle' = 'first_in_bundle';
  export const TOP_FIELD: 'top_field' = 'top_field';
  export const BOTTOM_FIELD: 'bottom_field' = 'bottom_field';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoFrameFlags/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoFrameFlagsValue = "none" | "interlaced" | "tff" | "rff" | "onefield" | "multiple_view" | "first_in_bundle" | "top_field" | "bottom_field";
