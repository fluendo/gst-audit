export namespace GstMessageType {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const EOS: 'eos' = 'eos';
  export const ERROR: 'error' = 'error';
  export const WARNING: 'warning' = 'warning';
  export const INFO: 'info' = 'info';
  export const TAG: 'tag' = 'tag';
  export const BUFFERING: 'buffering' = 'buffering';
  export const STATE_CHANGED: 'state_changed' = 'state_changed';
  export const STATE_DIRTY: 'state_dirty' = 'state_dirty';
  export const STEP_DONE: 'step_done' = 'step_done';
  export const CLOCK_PROVIDE: 'clock_provide' = 'clock_provide';
  export const CLOCK_LOST: 'clock_lost' = 'clock_lost';
  export const NEW_CLOCK: 'new_clock' = 'new_clock';
  export const STRUCTURE_CHANGE: 'structure_change' = 'structure_change';
  export const STREAM_STATUS: 'stream_status' = 'stream_status';
  export const APPLICATION: 'application' = 'application';
  export const ELEMENT: 'element' = 'element';
  export const SEGMENT_START: 'segment_start' = 'segment_start';
  export const SEGMENT_DONE: 'segment_done' = 'segment_done';
  export const DURATION_CHANGED: 'duration_changed' = 'duration_changed';
  export const LATENCY: 'latency' = 'latency';
  export const ASYNC_START: 'async_start' = 'async_start';
  export const ASYNC_DONE: 'async_done' = 'async_done';
  export const REQUEST_STATE: 'request_state' = 'request_state';
  export const STEP_START: 'step_start' = 'step_start';
  export const QOS: 'qos' = 'qos';
  export const PROGRESS: 'progress' = 'progress';
  export const TOC: 'toc' = 'toc';
  export const RESET_TIME: 'reset_time' = 'reset_time';
  export const STREAM_START: 'stream_start' = 'stream_start';
  export const NEED_CONTEXT: 'need_context' = 'need_context';
  export const HAVE_CONTEXT: 'have_context' = 'have_context';
  export const EXTENDED: 'extended' = 'extended';
  export const DEVICE_ADDED: 'device_added' = 'device_added';
  export const DEVICE_REMOVED: 'device_removed' = 'device_removed';
  export const PROPERTY_NOTIFY: 'property_notify' = 'property_notify';
  export const STREAM_COLLECTION: 'stream_collection' = 'stream_collection';
  export const STREAMS_SELECTED: 'streams_selected' = 'streams_selected';
  export const REDIRECT: 'redirect' = 'redirect';
  export const DEVICE_CHANGED: 'device_changed' = 'device_changed';
  export const INSTANT_RATE_REQUEST: 'instant_rate_request' = 'instant_rate_request';
  export const ANY: 'any' = 'any';
    







 
  export async function get_name(type_: GstMessageTypeValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MessageType/get_name`, apiConfig.baseUrl);
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

    







 
  export async function to_quark(type_: GstMessageTypeValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MessageType/to_quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/MessageType/get_type`, apiConfig.baseUrl);
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
  export type GstMessageTypeValue = "unknown" | "eos" | "error" | "warning" | "info" | "tag" | "buffering" | "state_changed" | "state_dirty" | "step_done" | "clock_provide" | "clock_lost" | "new_clock" | "structure_change" | "stream_status" | "application" | "element" | "segment_start" | "segment_done" | "duration_changed" | "latency" | "async_start" | "async_done" | "request_state" | "step_start" | "qos" | "progress" | "toc" | "reset_time" | "stream_start" | "need_context" | "have_context" | "extended" | "device_added" | "device_removed" | "property_notify" | "stream_collection" | "streams_selected" | "redirect" | "device_changed" | "instant_rate_request" | "any";
