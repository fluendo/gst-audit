export namespace GstVideoVideoAFDSpec {
  export const DVB_ETSI: 'dvb_etsi' = 'dvb_etsi';
  export const ATSC_A53: 'atsc_a53' = 'atsc_a53';
  export const SMPTE_ST2016_1: 'smpte_st2016_1' = 'smpte_st2016_1';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoAFDSpec/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoAFDSpecValue = "dvb_etsi" | "atsc_a53" | "smpte_st2016_1";
