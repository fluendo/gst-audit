export namespace GstDebugColorFlags {
  export const FG_BLACK: 'fg_black' = 'fg_black';
  export const FG_RED: 'fg_red' = 'fg_red';
  export const FG_GREEN: 'fg_green' = 'fg_green';
  export const FG_YELLOW: 'fg_yellow' = 'fg_yellow';
  export const FG_BLUE: 'fg_blue' = 'fg_blue';
  export const FG_MAGENTA: 'fg_magenta' = 'fg_magenta';
  export const FG_CYAN: 'fg_cyan' = 'fg_cyan';
  export const FG_WHITE: 'fg_white' = 'fg_white';
  export const BG_BLACK: 'bg_black' = 'bg_black';
  export const BG_RED: 'bg_red' = 'bg_red';
  export const BG_GREEN: 'bg_green' = 'bg_green';
  export const BG_YELLOW: 'bg_yellow' = 'bg_yellow';
  export const BG_BLUE: 'bg_blue' = 'bg_blue';
  export const BG_MAGENTA: 'bg_magenta' = 'bg_magenta';
  export const BG_CYAN: 'bg_cyan' = 'bg_cyan';
  export const BG_WHITE: 'bg_white' = 'bg_white';
  export const BOLD: 'bold' = 'bold';
  export const UNDERLINE: 'underline' = 'underline';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/DebugColorFlags/get_type`, apiConfig.baseUrl);
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
  export type GstDebugColorFlagsValue = "fg_black" | "fg_red" | "fg_green" | "fg_yellow" | "fg_blue" | "fg_magenta" | "fg_cyan" | "fg_white" | "bg_black" | "bg_red" | "bg_green" | "bg_yellow" | "bg_blue" | "bg_magenta" | "bg_cyan" | "bg_white" | "bold" | "underline";
