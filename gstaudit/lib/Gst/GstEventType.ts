export namespace GstEventType {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const FLUSH_START: 'flush_start' = 'flush_start';
  export const FLUSH_STOP: 'flush_stop' = 'flush_stop';
  export const STREAM_START: 'stream_start' = 'stream_start';
  export const CAPS: 'caps' = 'caps';
  export const SEGMENT: 'segment' = 'segment';
  export const STREAM_COLLECTION: 'stream_collection' = 'stream_collection';
  export const TAG: 'tag' = 'tag';
  export const BUFFERSIZE: 'buffersize' = 'buffersize';
  export const SINK_MESSAGE: 'sink_message' = 'sink_message';
  export const STREAM_GROUP_DONE: 'stream_group_done' = 'stream_group_done';
  export const EOS: 'eos' = 'eos';
  export const TOC: 'toc' = 'toc';
  export const PROTECTION: 'protection' = 'protection';
  export const SEGMENT_DONE: 'segment_done' = 'segment_done';
  export const GAP: 'gap' = 'gap';
  export const INSTANT_RATE_CHANGE: 'instant_rate_change' = 'instant_rate_change';
  export const QOS: 'qos' = 'qos';
  export const SEEK: 'seek' = 'seek';
  export const NAVIGATION: 'navigation' = 'navigation';
  export const LATENCY: 'latency' = 'latency';
  export const STEP: 'step' = 'step';
  export const RECONFIGURE: 'reconfigure' = 'reconfigure';
  export const TOC_SELECT: 'toc_select' = 'toc_select';
  export const SELECT_STREAMS: 'select_streams' = 'select_streams';
  export const INSTANT_RATE_SYNC_TIME: 'instant_rate_sync_time' = 'instant_rate_sync_time';
  export const CUSTOM_UPSTREAM: 'custom_upstream' = 'custom_upstream';
  export const CUSTOM_DOWNSTREAM: 'custom_downstream' = 'custom_downstream';
  export const CUSTOM_DOWNSTREAM_OOB: 'custom_downstream_oob' = 'custom_downstream_oob';
  export const CUSTOM_DOWNSTREAM_STICKY: 'custom_downstream_sticky' = 'custom_downstream_sticky';
  export const CUSTOM_BOTH: 'custom_both' = 'custom_both';
  export const CUSTOM_BOTH_OOB: 'custom_both_oob' = 'custom_both_oob';
    







 
  export async function get_flags(type_: GstEventTypeValue): Promise<GstEventTypeFlagsValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventType/get_flags`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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

    







 
  export async function get_name(type_: GstEventTypeValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventType/get_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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

    







 
  export async function to_quark(type_: GstEventTypeValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventType/to_quark`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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

    







 
  export async function to_sticky_ordering(type_: GstEventTypeValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventType/to_sticky_ordering`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/EventType/get_type`, apiConfig.baseUrl);
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
  export type GstEventTypeValue = "unknown" | "flush_start" | "flush_stop" | "stream_start" | "caps" | "segment" | "stream_collection" | "tag" | "buffersize" | "sink_message" | "stream_group_done" | "eos" | "toc" | "protection" | "segment_done" | "gap" | "instant_rate_change" | "qos" | "seek" | "navigation" | "latency" | "step" | "reconfigure" | "toc_select" | "select_streams" | "instant_rate_sync_time" | "custom_upstream" | "custom_downstream" | "custom_downstream_oob" | "custom_downstream_sticky" | "custom_both" | "custom_both_oob";
