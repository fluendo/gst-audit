export namespace GstPadLinkCheck {
  export const NOTHING: 'nothing' = 'nothing';
  export const HIERARCHY: 'hierarchy' = 'hierarchy';
  export const TEMPLATE_CAPS: 'template_caps' = 'template_caps';
  export const CAPS: 'caps' = 'caps';
  export const NO_RECONFIGURE: 'no_reconfigure' = 'no_reconfigure';
  export const DEFAULT: 'default' = 'default';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/PadLinkCheck/get_type`, apiConfig.baseUrl);
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
  export type GstPadLinkCheckValue = "nothing" | "hierarchy" | "template_caps" | "caps" | "no_reconfigure" | "default";
