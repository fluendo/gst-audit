export namespace GstClockReturn {
  export const OK: 'ok' = 'ok';
  export const EARLY: 'early' = 'early';
  export const UNSCHEDULED: 'unscheduled' = 'unscheduled';
  export const BUSY: 'busy' = 'busy';
  export const BADTIME: 'badtime' = 'badtime';
  export const ERROR: 'error' = 'error';
  export const UNSUPPORTED: 'unsupported' = 'unsupported';
  export const DONE: 'done' = 'done';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ClockReturn/get_type`, apiConfig.baseUrl);
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
  export type GstClockReturnValue = "ok" | "early" | "unscheduled" | "busy" | "badtime" | "error" | "unsupported" | "done";
