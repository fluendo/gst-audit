export namespace GstParseFlags {
  export const NONE: 'none' = 'none';
  export const FATAL_ERRORS: 'fatal_errors' = 'fatal_errors';
  export const NO_SINGLE_ELEMENT_BINS: 'no_single_element_bins' = 'no_single_element_bins';
  export const PLACE_IN_BIN: 'place_in_bin' = 'place_in_bin';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/ParseFlags/get_type`, apiConfig.baseUrl);
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
  export type GstParseFlagsValue = "none" | "fatal_errors" | "no_single_element_bins" | "place_in_bin";
