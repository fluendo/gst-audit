export namespace GstElementFlags {
  export const LOCKED_STATE: 'locked_state' = 'locked_state';
  export const SINK: 'sink' = 'sink';
  export const SOURCE: 'source' = 'source';
  export const PROVIDE_CLOCK: 'provide_clock' = 'provide_clock';
  export const REQUIRE_CLOCK: 'require_clock' = 'require_clock';
  export const INDEXABLE: 'indexable' = 'indexable';
  export const LAST: 'last' = 'last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ElementFlags/get_type`, apiConfig.baseUrl);
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
  export type GstElementFlagsValue = "locked_state" | "sink" | "source" | "provide_clock" | "require_clock" | "indexable" | "last";
