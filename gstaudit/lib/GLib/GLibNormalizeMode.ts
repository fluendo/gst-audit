export namespace GLibNormalizeMode {
  export const DEFAULT: 'default' = 'default';
  export const NFD: 'nfd' = 'nfd';
  export const DEFAULT_COMPOSE: 'default_compose' = 'default_compose';
  export const NFC: 'nfc' = 'nfc';
  export const ALL: 'all' = 'all';
  export const NFKD: 'nfkd' = 'nfkd';
  export const ALL_COMPOSE: 'all_compose' = 'all_compose';
  export const NFKC: 'nfkc' = 'nfkc';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/NormalizeMode/get_type`, apiConfig.baseUrl);
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
  export type GLibNormalizeModeValue = "default" | "nfd" | "default_compose" | "nfc" | "all" | "nfkd" | "all_compose" | "nfkc";
