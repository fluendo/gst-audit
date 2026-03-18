export namespace GstParseError {
  export const SYNTAX: 'syntax' = 'syntax';
  export const NO_SUCH_ELEMENT: 'no_such_element' = 'no_such_element';
  export const NO_SUCH_PROPERTY: 'no_such_property' = 'no_such_property';
  export const LINK: 'link' = 'link';
  export const COULD_NOT_SET_PROPERTY: 'could_not_set_property' = 'could_not_set_property';
  export const EMPTY_BIN: 'empty_bin' = 'empty_bin';
  export const EMPTY: 'empty' = 'empty';
  export const DELAYED_LINK: 'delayed_link' = 'delayed_link';
    







 
  export async function quark(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ParseError/quark`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ParseError/get_type`, apiConfig.baseUrl);
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
  export type GstParseErrorValue = "syntax" | "no_such_element" | "no_such_property" | "link" | "could_not_set_property" | "empty_bin" | "empty" | "delayed_link";
