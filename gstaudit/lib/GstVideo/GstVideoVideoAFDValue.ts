export namespace GstVideoVideoAFDValue {
  export const UNAVAILABLE: 'unavailable' = 'unavailable';
  export const _16_9_TOP_ALIGNED: '16_9_top_aligned' = '16_9_top_aligned';
  export const _14_9_TOP_ALIGNED: '14_9_top_aligned' = '14_9_top_aligned';
  export const GREATER_THAN_16_9: 'greater_than_16_9' = 'greater_than_16_9';
  export const _4_3_FULL_16_9_FULL: '4_3_full_16_9_full' = '4_3_full_16_9_full';
  export const _4_3_FULL_4_3_PILLAR: '4_3_full_4_3_pillar' = '4_3_full_4_3_pillar';
  export const _16_9_LETTER_16_9_FULL: '16_9_letter_16_9_full' = '16_9_letter_16_9_full';
  export const _14_9_LETTER_14_9_PILLAR: '14_9_letter_14_9_pillar' = '14_9_letter_14_9_pillar';
  export const _4_3_FULL_14_9_CENTER: '4_3_full_14_9_center' = '4_3_full_14_9_center';
  export const _16_9_LETTER_14_9_CENTER: '16_9_letter_14_9_center' = '16_9_letter_14_9_center';
  export const _16_9_LETTER_4_3_CENTER: '16_9_letter_4_3_center' = '16_9_letter_4_3_center';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoAFDValue/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoAFDValueValue = "unavailable" | "16_9_top_aligned" | "14_9_top_aligned" | "greater_than_16_9" | "4_3_full_16_9_full" | "4_3_full_4_3_pillar" | "16_9_letter_16_9_full" | "14_9_letter_14_9_pillar" | "4_3_full_14_9_center" | "16_9_letter_14_9_center" | "16_9_letter_4_3_center";
