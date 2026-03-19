export namespace GstResourceError {
  export const FAILED: 'failed' = 'failed';
  export const TOO_LAZY: 'too_lazy' = 'too_lazy';
  export const NOT_FOUND: 'not_found' = 'not_found';
  export const BUSY: 'busy' = 'busy';
  export const OPEN_READ: 'open_read' = 'open_read';
  export const OPEN_WRITE: 'open_write' = 'open_write';
  export const OPEN_READ_WRITE: 'open_read_write' = 'open_read_write';
  export const CLOSE: 'close' = 'close';
  export const READ: 'read' = 'read';
  export const WRITE: 'write' = 'write';
  export const SEEK: 'seek' = 'seek';
  export const SYNC: 'sync' = 'sync';
  export const SETTINGS: 'settings' = 'settings';
  export const NO_SPACE_LEFT: 'no_space_left' = 'no_space_left';
  export const NOT_AUTHORIZED: 'not_authorized' = 'not_authorized';
  export const NUM_ERRORS: 'num_errors' = 'num_errors';
    







 
  export async function quark(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ResourceError/quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ResourceError/get_type`, apiConfig.baseUrl);
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
  export type GstResourceErrorValue = "failed" | "too_lazy" | "not_found" | "busy" | "open_read" | "open_write" | "open_read_write" | "close" | "read" | "write" | "seek" | "sync" | "settings" | "no_space_left" | "not_authorized" | "num_errors";
