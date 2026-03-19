export namespace GstStreamStatusType {
  export const CREATE: 'create' = 'create';
  export const ENTER: 'enter' = 'enter';
  export const LEAVE: 'leave' = 'leave';
  export const DESTROY: 'destroy' = 'destroy';
  export const START: 'start' = 'start';
  export const PAUSE: 'pause' = 'pause';
  export const STOP: 'stop' = 'stop';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/StreamStatusType/get_type`, apiConfig.baseUrl);
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
  export type GstStreamStatusTypeValue = "create" | "enter" | "leave" | "destroy" | "start" | "pause" | "stop";
