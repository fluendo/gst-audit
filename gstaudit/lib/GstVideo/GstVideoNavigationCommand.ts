export namespace GstVideoNavigationCommand {
  export const INVALID: 'invalid' = 'invalid';
  export const MENU1: 'menu1' = 'menu1';
  export const MENU2: 'menu2' = 'menu2';
  export const MENU3: 'menu3' = 'menu3';
  export const MENU4: 'menu4' = 'menu4';
  export const MENU5: 'menu5' = 'menu5';
  export const MENU6: 'menu6' = 'menu6';
  export const MENU7: 'menu7' = 'menu7';
  export const LEFT: 'left' = 'left';
  export const RIGHT: 'right' = 'right';
  export const UP: 'up' = 'up';
  export const DOWN: 'down' = 'down';
  export const ACTIVATE: 'activate' = 'activate';
  export const PREV_ANGLE: 'prev_angle' = 'prev_angle';
  export const NEXT_ANGLE: 'next_angle' = 'next_angle';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/NavigationCommand/get_type`, apiConfig.baseUrl);
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
  export type GstVideoNavigationCommandValue = "invalid" | "menu1" | "menu2" | "menu3" | "menu4" | "menu5" | "menu6" | "menu7" | "left" | "right" | "up" | "down" | "activate" | "prev_angle" | "next_angle";
