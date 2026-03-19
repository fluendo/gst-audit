export namespace GstLibraryError {
  export const FAILED: 'failed' = 'failed';
  export const TOO_LAZY: 'too_lazy' = 'too_lazy';
  export const INIT: 'init' = 'init';
  export const SHUTDOWN: 'shutdown' = 'shutdown';
  export const SETTINGS: 'settings' = 'settings';
  export const ENCODE: 'encode' = 'encode';
  export const NUM_ERRORS: 'num_errors' = 'num_errors';
    







 
  export async function quark(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/LibraryError/quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/LibraryError/get_type`, apiConfig.baseUrl);
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
  export type GstLibraryErrorValue = "failed" | "too_lazy" | "init" | "shutdown" | "settings" | "encode" | "num_errors";
