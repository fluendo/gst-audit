export namespace GstPadFlags {
  export const BLOCKED: 'blocked' = 'blocked';
  export const FLUSHING: 'flushing' = 'flushing';
  export const EOS: 'eos' = 'eos';
  export const BLOCKING: 'blocking' = 'blocking';
  export const NEED_PARENT: 'need_parent' = 'need_parent';
  export const NEED_RECONFIGURE: 'need_reconfigure' = 'need_reconfigure';
  export const PENDING_EVENTS: 'pending_events' = 'pending_events';
  export const FIXED_CAPS: 'fixed_caps' = 'fixed_caps';
  export const PROXY_CAPS: 'proxy_caps' = 'proxy_caps';
  export const PROXY_ALLOCATION: 'proxy_allocation' = 'proxy_allocation';
  export const PROXY_SCHEDULING: 'proxy_scheduling' = 'proxy_scheduling';
  export const ACCEPT_INTERSECT: 'accept_intersect' = 'accept_intersect';
  export const ACCEPT_TEMPLATE: 'accept_template' = 'accept_template';
  export const LAST: 'last' = 'last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/PadFlags/get_type`, apiConfig.baseUrl);
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
  export type GstPadFlagsValue = "blocked" | "flushing" | "eos" | "blocking" | "need_parent" | "need_reconfigure" | "pending_events" | "fixed_caps" | "proxy_caps" | "proxy_allocation" | "proxy_scheduling" | "accept_intersect" | "accept_template" | "last";
