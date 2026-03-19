export namespace GstVideoVideoCodecFrameFlags {
  export const DECODE_ONLY: 'decode_only' = 'decode_only';
  export const SYNC_POINT: 'sync_point' = 'sync_point';
  export const FORCE_KEYFRAME: 'force_keyframe' = 'force_keyframe';
  export const FORCE_KEYFRAME_HEADERS: 'force_keyframe_headers' = 'force_keyframe_headers';
  export const CORRUPTED: 'corrupted' = 'corrupted';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoCodecFrameFlags/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoCodecFrameFlagsValue = "decode_only" | "sync_point" | "force_keyframe" | "force_keyframe_headers" | "corrupted";
