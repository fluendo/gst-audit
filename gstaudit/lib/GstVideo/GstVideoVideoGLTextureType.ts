export namespace GstVideoVideoGLTextureType {
  export const LUMINANCE: 'luminance' = 'luminance';
  export const LUMINANCE_ALPHA: 'luminance_alpha' = 'luminance_alpha';
  export const RGB16: 'rgb16' = 'rgb16';
  export const RGB: 'rgb' = 'rgb';
  export const RGBA: 'rgba' = 'rgba';
  export const R: 'r' = 'r';
  export const RG: 'rg' = 'rg';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoGLTextureType/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoGLTextureTypeValue = "luminance" | "luminance_alpha" | "rgb16" | "rgb" | "rgba" | "r" | "rg";
