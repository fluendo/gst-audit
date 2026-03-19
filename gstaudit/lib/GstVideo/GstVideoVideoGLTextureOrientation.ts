export namespace GstVideoVideoGLTextureOrientation {
  export const NORMAL_Y_NORMAL: 'normal_y_normal' = 'normal_y_normal';
  export const NORMAL_Y_FLIP: 'normal_y_flip' = 'normal_y_flip';
  export const FLIP_Y_NORMAL: 'flip_y_normal' = 'flip_y_normal';
  export const FLIP_Y_FLIP: 'flip_y_flip' = 'flip_y_flip';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoGLTextureOrientation/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoGLTextureOrientationValue = "normal_y_normal" | "normal_y_flip" | "flip_y_normal" | "flip_y_flip";
