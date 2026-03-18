export namespace GstDebugLevel {
  export const NONE: 'none' = 'none';
  export const ERROR: 'error' = 'error';
  export const WARNING: 'warning' = 'warning';
  export const FIXME: 'fixme' = 'fixme';
  export const INFO: 'info' = 'info';
  export const DEBUG: 'debug' = 'debug';
  export const LOG: 'log' = 'log';
  export const TRACE: 'trace' = 'trace';
  export const MEMDUMP: 'memdump' = 'memdump';
  export const COUNT: 'count' = 'count';
    







 
  export async function get_name(level: GstDebugLevelValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/DebugLevel/get_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('level', String(level));
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/DebugLevel/get_type`, apiConfig.baseUrl);
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
  export type GstDebugLevelValue = "none" | "error" | "warning" | "fixme" | "info" | "debug" | "log" | "trace" | "memdump" | "count";
