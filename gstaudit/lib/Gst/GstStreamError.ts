export namespace GstStreamError {
  export const FAILED: 'failed' = 'failed';
  export const TOO_LAZY: 'too_lazy' = 'too_lazy';
  export const NOT_IMPLEMENTED: 'not_implemented' = 'not_implemented';
  export const TYPE_NOT_FOUND: 'type_not_found' = 'type_not_found';
  export const WRONG_TYPE: 'wrong_type' = 'wrong_type';
  export const CODEC_NOT_FOUND: 'codec_not_found' = 'codec_not_found';
  export const DECODE: 'decode' = 'decode';
  export const ENCODE: 'encode' = 'encode';
  export const DEMUX: 'demux' = 'demux';
  export const MUX: 'mux' = 'mux';
  export const FORMAT: 'format' = 'format';
  export const DECRYPT: 'decrypt' = 'decrypt';
  export const DECRYPT_NOKEY: 'decrypt_nokey' = 'decrypt_nokey';
  export const NUM_ERRORS: 'num_errors' = 'num_errors';
    







 
  export async function quark(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/StreamError/quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/StreamError/get_type`, apiConfig.baseUrl);
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
  export type GstStreamErrorValue = "failed" | "too_lazy" | "not_implemented" | "type_not_found" | "wrong_type" | "codec_not_found" | "decode" | "encode" | "demux" | "mux" | "format" | "decrypt" | "decrypt_nokey" | "num_errors";
