export namespace GstFlowReturn {
  export const CUSTOM_SUCCESS_2: 'custom_success_2' = 'custom_success_2';
  export const CUSTOM_SUCCESS_1: 'custom_success_1' = 'custom_success_1';
  export const CUSTOM_SUCCESS: 'custom_success' = 'custom_success';
  export const OK: 'ok' = 'ok';
  export const NOT_LINKED: 'not_linked' = 'not_linked';
  export const FLUSHING: 'flushing' = 'flushing';
  export const EOS: 'eos' = 'eos';
  export const NOT_NEGOTIATED: 'not_negotiated' = 'not_negotiated';
  export const ERROR: 'error' = 'error';
  export const NOT_SUPPORTED: 'not_supported' = 'not_supported';
  export const CUSTOM_ERROR: 'custom_error' = 'custom_error';
  export const CUSTOM_ERROR_1: 'custom_error_1' = 'custom_error_1';
  export const CUSTOM_ERROR_2: 'custom_error_2' = 'custom_error_2';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/FlowReturn/get_type`, apiConfig.baseUrl);
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
  export type GstFlowReturnValue = "custom_success_2" | "custom_success_1" | "custom_success" | "ok" | "not_linked" | "flushing" | "eos" | "not_negotiated" | "error" | "not_supported" | "custom_error" | "custom_error_1" | "custom_error_2";
