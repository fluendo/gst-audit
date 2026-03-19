export namespace GstVideoNavigationMessageType {
  export const INVALID: 'invalid' = 'invalid';
  export const MOUSE_OVER: 'mouse_over' = 'mouse_over';
  export const COMMANDS_CHANGED: 'commands_changed' = 'commands_changed';
  export const ANGLES_CHANGED: 'angles_changed' = 'angles_changed';
  export const EVENT: 'event' = 'event';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/NavigationMessageType/get_type`, apiConfig.baseUrl);
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
  export type GstVideoNavigationMessageTypeValue = "invalid" | "mouse_over" | "commands_changed" | "angles_changed" | "event";
