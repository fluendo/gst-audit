export namespace GstVideoNavigationEventType {
  export const INVALID: 'invalid' = 'invalid';
  export const KEY_PRESS: 'key_press' = 'key_press';
  export const KEY_RELEASE: 'key_release' = 'key_release';
  export const MOUSE_BUTTON_PRESS: 'mouse_button_press' = 'mouse_button_press';
  export const MOUSE_BUTTON_RELEASE: 'mouse_button_release' = 'mouse_button_release';
  export const MOUSE_MOVE: 'mouse_move' = 'mouse_move';
  export const COMMAND: 'command' = 'command';
  export const MOUSE_SCROLL: 'mouse_scroll' = 'mouse_scroll';
  export const TOUCH_DOWN: 'touch_down' = 'touch_down';
  export const TOUCH_MOTION: 'touch_motion' = 'touch_motion';
  export const TOUCH_UP: 'touch_up' = 'touch_up';
  export const TOUCH_FRAME: 'touch_frame' = 'touch_frame';
  export const TOUCH_CANCEL: 'touch_cancel' = 'touch_cancel';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/NavigationEventType/get_type`, apiConfig.baseUrl);
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
  export type GstVideoNavigationEventTypeValue = "invalid" | "key_press" | "key_release" | "mouse_button_press" | "mouse_button_release" | "mouse_move" | "command" | "mouse_scroll" | "touch_down" | "touch_motion" | "touch_up" | "touch_frame" | "touch_cancel";
