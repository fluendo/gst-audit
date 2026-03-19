export namespace GstPluginDependencyFlags {
  export const NONE: 'none' = 'none';
  export const RECURSE: 'recurse' = 'recurse';
  export const PATHS_ARE_DEFAULT_ONLY: 'paths_are_default_only' = 'paths_are_default_only';
  export const FILE_NAME_IS_SUFFIX: 'file_name_is_suffix' = 'file_name_is_suffix';
  export const FILE_NAME_IS_PREFIX: 'file_name_is_prefix' = 'file_name_is_prefix';
  export const PATHS_ARE_RELATIVE_TO_EXE: 'paths_are_relative_to_exe' = 'paths_are_relative_to_exe';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/PluginDependencyFlags/get_type`, apiConfig.baseUrl);
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
  export type GstPluginDependencyFlagsValue = "none" | "recurse" | "paths_are_default_only" | "file_name_is_suffix" | "file_name_is_prefix" | "paths_are_relative_to_exe";
