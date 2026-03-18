
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstSample } from '../Gst/GstSample';



export type GstVideoVideoConvertSampleCallback = (sample: GstSample, error_: Pointer, user_data: Pointer) => void;

export async function convertGstVideoVideoConvertSampleCallbackArgs(data: any): Promise<Parameters<GstVideoVideoConvertSampleCallback>> {
  return [
    await GstSample.create(data.sample.ptr, 'none'),
    data.error,
    data.user_data  ];
}
