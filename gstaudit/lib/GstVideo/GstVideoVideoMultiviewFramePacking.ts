export namespace GstVideoVideoMultiviewFramePacking {
  export const NONE: 'none' = 'none';
  export const MONO: 'mono' = 'mono';
  export const LEFT: 'left' = 'left';
  export const RIGHT: 'right' = 'right';
  export const SIDE_BY_SIDE: 'side_by_side' = 'side_by_side';
  export const SIDE_BY_SIDE_QUINCUNX: 'side_by_side_quincunx' = 'side_by_side_quincunx';
  export const COLUMN_INTERLEAVED: 'column_interleaved' = 'column_interleaved';
  export const ROW_INTERLEAVED: 'row_interleaved' = 'row_interleaved';
  export const TOP_BOTTOM: 'top_bottom' = 'top_bottom';
  export const CHECKERBOARD: 'checkerboard' = 'checkerboard';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoMultiviewFramePacking/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoMultiviewFramePackingValue = "none" | "mono" | "left" | "right" | "side_by_side" | "side_by_side_quincunx" | "column_interleaved" | "row_interleaved" | "top_bottom" | "checkerboard";
