export namespace GstVideoVideoOrientationMethod {
  export const IDENTITY: 'identity' = 'identity';
  export const 90R: '90r' = '90r';
  export const 180: '180' = '180';
  export const 90L: '90l' = '90l';
  export const HORIZ: 'horiz' = 'horiz';
  export const VERT: 'vert' = 'vert';
  export const UL_LR: 'ul_lr' = 'ul_lr';
  export const UR_LL: 'ur_ll' = 'ur_ll';
  export const AUTO: 'auto' = 'auto';
  export const CUSTOM: 'custom' = 'custom';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoOrientationMethod/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoOrientationMethodValue = "identity" | "90r" | "180" | "90l" | "horiz" | "vert" | "ul_lr" | "ur_ll" | "auto" | "custom";
