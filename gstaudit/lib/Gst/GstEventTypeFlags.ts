export namespace GstEventTypeFlags {
  export const UPSTREAM: 'upstream' = 'upstream';
  export const DOWNSTREAM: 'downstream' = 'downstream';
  export const SERIALIZED: 'serialized' = 'serialized';
  export const STICKY: 'sticky' = 'sticky';
  export const STICKY_MULTI: 'sticky_multi' = 'sticky_multi';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventTypeFlags/get_type`, apiConfig.baseUrl);
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
  export type GstEventTypeFlagsValue = "upstream" | "downstream" | "serialized" | "sticky" | "sticky_multi";
