export namespace GObjectBindingFlags {
  export const DEFAULT: 'default' = 'default';
  export const BIDIRECTIONAL: 'bidirectional' = 'bidirectional';
  export const SYNC_CREATE: 'sync_create' = 'sync_create';
  export const INVERT_BOOLEAN: 'invert_boolean' = 'invert_boolean';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/BindingFlags/get_type`, apiConfig.baseUrl);
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
  export type GObjectBindingFlagsValue = "default" | "bidirectional" | "sync_create" | "invert_boolean";
