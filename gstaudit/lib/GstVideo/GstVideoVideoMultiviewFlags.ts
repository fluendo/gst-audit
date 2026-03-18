export namespace GstVideoVideoMultiviewFlags {
  export const NONE: 'none' = 'none';
  export const RIGHT_VIEW_FIRST: 'right_view_first' = 'right_view_first';
  export const LEFT_FLIPPED: 'left_flipped' = 'left_flipped';
  export const LEFT_FLOPPED: 'left_flopped' = 'left_flopped';
  export const RIGHT_FLIPPED: 'right_flipped' = 'right_flipped';
  export const RIGHT_FLOPPED: 'right_flopped' = 'right_flopped';
  export const HALF_ASPECT: 'half_aspect' = 'half_aspect';
  export const MIXED_MONO: 'mixed_mono' = 'mixed_mono';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoMultiviewFlags/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoMultiviewFlagsValue = "none" | "right_view_first" | "left_flipped" | "left_flopped" | "right_flipped" | "right_flopped" | "half_aspect" | "mixed_mono";
