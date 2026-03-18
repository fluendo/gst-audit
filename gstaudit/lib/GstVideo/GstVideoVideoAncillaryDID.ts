export namespace GstVideoVideoAncillaryDID {
  export const UNDEFINED: 'undefined' = 'undefined';
  export const DELETION: 'deletion' = 'deletion';
  export const HANC_3G_AUDIO_DATA_FIRST: 'hanc_3g_audio_data_first' = 'hanc_3g_audio_data_first';
  export const HANC_3G_AUDIO_DATA_LAST: 'hanc_3g_audio_data_last' = 'hanc_3g_audio_data_last';
  export const HANC_HDTV_AUDIO_DATA_FIRST: 'hanc_hdtv_audio_data_first' = 'hanc_hdtv_audio_data_first';
  export const HANC_HDTV_AUDIO_DATA_LAST: 'hanc_hdtv_audio_data_last' = 'hanc_hdtv_audio_data_last';
  export const HANC_SDTV_AUDIO_DATA_1_FIRST: 'hanc_sdtv_audio_data_1_first' = 'hanc_sdtv_audio_data_1_first';
  export const HANC_SDTV_AUDIO_DATA_1_LAST: 'hanc_sdtv_audio_data_1_last' = 'hanc_sdtv_audio_data_1_last';
  export const CAMERA_POSITION: 'camera_position' = 'camera_position';
  export const HANC_ERROR_DETECTION: 'hanc_error_detection' = 'hanc_error_detection';
  export const HANC_SDTV_AUDIO_DATA_2_FIRST: 'hanc_sdtv_audio_data_2_first' = 'hanc_sdtv_audio_data_2_first';
  export const HANC_SDTV_AUDIO_DATA_2_LAST: 'hanc_sdtv_audio_data_2_last' = 'hanc_sdtv_audio_data_2_last';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoAncillaryDID/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoAncillaryDIDValue = "undefined" | "deletion" | "hanc_3g_audio_data_first" | "hanc_3g_audio_data_last" | "hanc_hdtv_audio_data_first" | "hanc_hdtv_audio_data_last" | "hanc_sdtv_audio_data_1_first" | "hanc_sdtv_audio_data_1_last" | "camera_position" | "hanc_error_detection" | "hanc_sdtv_audio_data_2_first" | "hanc_sdtv_audio_data_2_last";
