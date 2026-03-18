export namespace GstTypeFindProbability {
  export const NONE: 'none' = 'none';
  export const MINIMUM: 'minimum' = 'minimum';
  export const POSSIBLE: 'possible' = 'possible';
  export const LIKELY: 'likely' = 'likely';
  export const NEARLY_CERTAIN: 'nearly_certain' = 'nearly_certain';
  export const MAXIMUM: 'maximum' = 'maximum';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/TypeFindProbability/get_type`, apiConfig.baseUrl);
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
  export type GstTypeFindProbabilityValue = "none" | "minimum" | "possible" | "likely" | "nearly_certain" | "maximum";
