export namespace GLibIOCondition {
  export const IN: 'in' = 'in';
  export const OUT: 'out' = 'out';
  export const PRI: 'pri' = 'pri';
  export const ERR: 'err' = 'err';
  export const HUP: 'hup' = 'hup';
  export const NVAL: 'nval' = 'nval';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/IOCondition/get_type`, apiConfig.baseUrl);
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
  export type GLibIOConditionValue = "in" | "out" | "pri" | "err" | "hup" | "nval";
