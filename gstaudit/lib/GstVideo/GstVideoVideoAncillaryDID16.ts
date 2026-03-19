export namespace GstVideoVideoAncillaryDID16 {
  export const S334_EIA_708: 's334_eia_708' = 's334_eia_708';
  export const S334_EIA_608: 's334_eia_608' = 's334_eia_608';
  export const S2016_3_AFD_BAR: 's2016_3_afd_bar' = 's2016_3_afd_bar';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoAncillaryDID16/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoAncillaryDID16Value = "s334_eia_708" | "s334_eia_608" | "s2016_3_afd_bar";
