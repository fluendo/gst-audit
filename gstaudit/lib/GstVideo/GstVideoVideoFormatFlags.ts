export namespace GstVideoVideoFormatFlags {
  export const YUV: 'yuv' = 'yuv';
  export const RGB: 'rgb' = 'rgb';
  export const GRAY: 'gray' = 'gray';
  export const ALPHA: 'alpha' = 'alpha';
  export const LE: 'le' = 'le';
  export const PALETTE: 'palette' = 'palette';
  export const COMPLEX: 'complex' = 'complex';
  export const UNPACK: 'unpack' = 'unpack';
  export const TILED: 'tiled' = 'tiled';
  export const SUBTILES: 'subtiles' = 'subtiles';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoFormatFlags/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoFormatFlagsValue = "yuv" | "rgb" | "gray" | "alpha" | "le" | "palette" | "complex" | "unpack" | "tiled" | "subtiles";
