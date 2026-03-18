export namespace GstStateChange {
  export const NULL_TO_READY: 'null_to_ready' = 'null_to_ready';
  export const READY_TO_PAUSED: 'ready_to_paused' = 'ready_to_paused';
  export const PAUSED_TO_PLAYING: 'paused_to_playing' = 'paused_to_playing';
  export const PLAYING_TO_PAUSED: 'playing_to_paused' = 'playing_to_paused';
  export const PAUSED_TO_READY: 'paused_to_ready' = 'paused_to_ready';
  export const READY_TO_NULL: 'ready_to_null' = 'ready_to_null';
  export const NULL_TO_NULL: 'null_to_null' = 'null_to_null';
  export const READY_TO_READY: 'ready_to_ready' = 'ready_to_ready';
  export const PAUSED_TO_PAUSED: 'paused_to_paused' = 'paused_to_paused';
  export const PLAYING_TO_PLAYING: 'playing_to_playing' = 'playing_to_playing';
    







 
  export async function get_name(transition: GstStateChangeValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/StateChange/get_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('transition', String(transition));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/StateChange/get_type`, apiConfig.baseUrl);
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
  export type GstStateChangeValue = "null_to_ready" | "ready_to_paused" | "paused_to_playing" | "playing_to_paused" | "paused_to_ready" | "ready_to_null" | "null_to_null" | "ready_to_ready" | "paused_to_paused" | "playing_to_playing";
