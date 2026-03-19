export namespace GstClockFlags {
  export const CAN_DO_SINGLE_SYNC: 'can_do_single_sync' = 'can_do_single_sync';
  export const CAN_DO_SINGLE_ASYNC: 'can_do_single_async' = 'can_do_single_async';
  export const CAN_DO_PERIODIC_SYNC: 'can_do_periodic_sync' = 'can_do_periodic_sync';
  export const CAN_DO_PERIODIC_ASYNC: 'can_do_periodic_async' = 'can_do_periodic_async';
  export const CAN_SET_RESOLUTION: 'can_set_resolution' = 'can_set_resolution';
  export const CAN_SET_MASTER: 'can_set_master' = 'can_set_master';
  export const NEEDS_STARTUP_SYNC: 'needs_startup_sync' = 'needs_startup_sync';
  export const LAST: 'last' = 'last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ClockFlags/get_type`, apiConfig.baseUrl);
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
  export type GstClockFlagsValue = "can_do_single_sync" | "can_do_single_async" | "can_do_periodic_sync" | "can_do_periodic_async" | "can_set_resolution" | "can_set_master" | "needs_startup_sync" | "last";
