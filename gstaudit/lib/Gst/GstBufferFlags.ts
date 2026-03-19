export namespace GstBufferFlags {
  export const LIVE: 'live' = 'live';
  export const DECODE_ONLY: 'decode_only' = 'decode_only';
  export const DISCONT: 'discont' = 'discont';
  export const RESYNC: 'resync' = 'resync';
  export const CORRUPTED: 'corrupted' = 'corrupted';
  export const MARKER: 'marker' = 'marker';
  export const HEADER: 'header' = 'header';
  export const GAP: 'gap' = 'gap';
  export const DROPPABLE: 'droppable' = 'droppable';
  export const DELTA_UNIT: 'delta_unit' = 'delta_unit';
  export const TAG_MEMORY: 'tag_memory' = 'tag_memory';
  export const SYNC_AFTER: 'sync_after' = 'sync_after';
  export const NON_DROPPABLE: 'non_droppable' = 'non_droppable';
  export const LAST: 'last' = 'last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/BufferFlags/get_type`, apiConfig.baseUrl);
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
  export type GstBufferFlagsValue = "live" | "decode_only" | "discont" | "resync" | "corrupted" | "marker" | "header" | "gap" | "droppable" | "delta_unit" | "tag_memory" | "sync_after" | "non_droppable" | "last";
