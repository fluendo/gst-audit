export namespace GstSegmentFlags {
  export const NONE: 'none' = 'none';
  export const RESET: 'reset' = 'reset';
  export const TRICKMODE: 'trickmode' = 'trickmode';
  export const SKIP: 'skip' = 'skip';
  export const SEGMENT: 'segment' = 'segment';
  export const TRICKMODE_KEY_UNITS: 'trickmode_key_units' = 'trickmode_key_units';
  export const TRICKMODE_FORWARD_PREDICTED: 'trickmode_forward_predicted' = 'trickmode_forward_predicted';
  export const TRICKMODE_NO_AUDIO: 'trickmode_no_audio' = 'trickmode_no_audio';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/SegmentFlags/get_type`, apiConfig.baseUrl);
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
  export type GstSegmentFlagsValue = "none" | "reset" | "trickmode" | "skip" | "segment" | "trickmode_key_units" | "trickmode_forward_predicted" | "trickmode_no_audio";
