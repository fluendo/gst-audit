export namespace GstTagMergeMode {
  export const UNDEFINED: 'undefined' = 'undefined';
  export const REPLACE_ALL: 'replace_all' = 'replace_all';
  export const REPLACE: 'replace' = 'replace';
  export const APPEND: 'append' = 'append';
  export const PREPEND: 'prepend' = 'prepend';
  export const KEEP: 'keep' = 'keep';
  export const KEEP_ALL: 'keep_all' = 'keep_all';
  export const COUNT: 'count' = 'count';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/TagMergeMode/get_type`, apiConfig.baseUrl);
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
  export type GstTagMergeModeValue = "undefined" | "replace_all" | "replace" | "append" | "prepend" | "keep" | "keep_all" | "count";
