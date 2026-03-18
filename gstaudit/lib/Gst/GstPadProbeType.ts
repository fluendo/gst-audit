export namespace GstPadProbeType {
  export const INVALID: 'invalid' = 'invalid';
  export const IDLE: 'idle' = 'idle';
  export const BLOCK: 'block' = 'block';
  export const BUFFER: 'buffer' = 'buffer';
  export const BUFFER_LIST: 'buffer_list' = 'buffer_list';
  export const EVENT_DOWNSTREAM: 'event_downstream' = 'event_downstream';
  export const EVENT_UPSTREAM: 'event_upstream' = 'event_upstream';
  export const EVENT_FLUSH: 'event_flush' = 'event_flush';
  export const QUERY_DOWNSTREAM: 'query_downstream' = 'query_downstream';
  export const QUERY_UPSTREAM: 'query_upstream' = 'query_upstream';
  export const PUSH: 'push' = 'push';
  export const PULL: 'pull' = 'pull';
  export const BLOCKING: 'blocking' = 'blocking';
  export const DATA_DOWNSTREAM: 'data_downstream' = 'data_downstream';
  export const DATA_UPSTREAM: 'data_upstream' = 'data_upstream';
  export const DATA_BOTH: 'data_both' = 'data_both';
  export const BLOCK_DOWNSTREAM: 'block_downstream' = 'block_downstream';
  export const BLOCK_UPSTREAM: 'block_upstream' = 'block_upstream';
  export const EVENT_BOTH: 'event_both' = 'event_both';
  export const QUERY_BOTH: 'query_both' = 'query_both';
  export const ALL_BOTH: 'all_both' = 'all_both';
  export const SCHEDULING: 'scheduling' = 'scheduling';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/PadProbeType/get_type`, apiConfig.baseUrl);
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
  export type GstPadProbeTypeValue = "invalid" | "idle" | "block" | "buffer" | "buffer_list" | "event_downstream" | "event_upstream" | "event_flush" | "query_downstream" | "query_upstream" | "push" | "pull" | "blocking" | "data_downstream" | "data_upstream" | "data_both" | "block_downstream" | "block_upstream" | "event_both" | "query_both" | "all_both" | "scheduling";
