export namespace GstQueryType {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const POSITION: 'position' = 'position';
  export const DURATION: 'duration' = 'duration';
  export const LATENCY: 'latency' = 'latency';
  export const JITTER: 'jitter' = 'jitter';
  export const RATE: 'rate' = 'rate';
  export const SEEKING: 'seeking' = 'seeking';
  export const SEGMENT: 'segment' = 'segment';
  export const CONVERT: 'convert' = 'convert';
  export const FORMATS: 'formats' = 'formats';
  export const BUFFERING: 'buffering' = 'buffering';
  export const CUSTOM: 'custom' = 'custom';
  export const URI: 'uri' = 'uri';
  export const ALLOCATION: 'allocation' = 'allocation';
  export const SCHEDULING: 'scheduling' = 'scheduling';
  export const ACCEPT_CAPS: 'accept_caps' = 'accept_caps';
  export const CAPS: 'caps' = 'caps';
  export const DRAIN: 'drain' = 'drain';
  export const CONTEXT: 'context' = 'context';
  export const BITRATE: 'bitrate' = 'bitrate';
  export const SELECTABLE: 'selectable' = 'selectable';
    







 
  export async function get_flags(type_: GstQueryTypeValue): Promise<GstQueryTypeFlagsValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/QueryType/get_flags`, apiConfig.baseUrl);
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

    







 
  export async function get_name(type_: GstQueryTypeValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/QueryType/get_name`, apiConfig.baseUrl);
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

    







 
  export async function to_quark(type_: GstQueryTypeValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/QueryType/to_quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/QueryType/get_type`, apiConfig.baseUrl);
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
  export type GstQueryTypeValue = "unknown" | "position" | "duration" | "latency" | "jitter" | "rate" | "seeking" | "segment" | "convert" | "formats" | "buffering" | "custom" | "uri" | "allocation" | "scheduling" | "accept_caps" | "caps" | "drain" | "context" | "bitrate" | "selectable";
