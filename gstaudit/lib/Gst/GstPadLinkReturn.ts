export namespace GstPadLinkReturn {
  export const OK: 'ok' = 'ok';
  export const WRONG_HIERARCHY: 'wrong_hierarchy' = 'wrong_hierarchy';
  export const WAS_LINKED: 'was_linked' = 'was_linked';
  export const WRONG_DIRECTION: 'wrong_direction' = 'wrong_direction';
  export const NOFORMAT: 'noformat' = 'noformat';
  export const NOSCHED: 'nosched' = 'nosched';
  export const REFUSED: 'refused' = 'refused';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/PadLinkReturn/get_type`, apiConfig.baseUrl);
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
  export type GstPadLinkReturnValue = "ok" | "wrong_hierarchy" | "was_linked" | "wrong_direction" | "noformat" | "nosched" | "refused";
