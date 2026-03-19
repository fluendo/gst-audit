export namespace GstCoreError {
  export const FAILED: 'failed' = 'failed';
  export const TOO_LAZY: 'too_lazy' = 'too_lazy';
  export const NOT_IMPLEMENTED: 'not_implemented' = 'not_implemented';
  export const STATE_CHANGE: 'state_change' = 'state_change';
  export const PAD: 'pad' = 'pad';
  export const THREAD: 'thread' = 'thread';
  export const NEGOTIATION: 'negotiation' = 'negotiation';
  export const EVENT: 'event' = 'event';
  export const SEEK: 'seek' = 'seek';
  export const CAPS: 'caps' = 'caps';
  export const TAG: 'tag' = 'tag';
  export const MISSING_PLUGIN: 'missing_plugin' = 'missing_plugin';
  export const CLOCK: 'clock' = 'clock';
  export const DISABLED: 'disabled' = 'disabled';
  export const NUM_ERRORS: 'num_errors' = 'num_errors';
    







 
  export async function quark(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/CoreError/quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/CoreError/get_type`, apiConfig.baseUrl);
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
  export type GstCoreErrorValue = "failed" | "too_lazy" | "not_implemented" | "state_change" | "pad" | "thread" | "negotiation" | "event" | "seek" | "caps" | "tag" | "missing_plugin" | "clock" | "disabled" | "num_errors";
