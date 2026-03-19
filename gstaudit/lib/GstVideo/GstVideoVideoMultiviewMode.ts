export namespace GstVideoVideoMultiviewMode {
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
  export const FRAME_BY_FRAME: 'frame_by_frame' = 'frame_by_frame';
  export const MULTIVIEW_FRAME_BY_FRAME: 'multiview_frame_by_frame' = 'multiview_frame_by_frame';
  export const SEPARATED: 'separated' = 'separated';
    







 
  export async function from_caps_string(caps_mview_mode: string): Promise<GstVideoVideoMultiviewModeValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoMultiviewMode/from_caps_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('caps_mview_mode', String(caps_mview_mode));
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

    







 
  export async function to_caps_string(mview_mode: GstVideoVideoMultiviewModeValue): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoMultiviewMode/to_caps_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('mview_mode', String(mview_mode));
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

    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoMultiviewMode/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoMultiviewModeValue = "none" | "mono" | "left" | "right" | "side_by_side" | "side_by_side_quincunx" | "column_interleaved" | "row_interleaved" | "top_bottom" | "checkerboard" | "frame_by_frame" | "multiview_frame_by_frame" | "separated";
