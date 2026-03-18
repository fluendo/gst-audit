
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoFilter } from './GstVideoVideoFilter';
import { GstVideoVideoFrame } from './GstVideoVideoFrame';



export type GstVideotransform_frame_ip = (trans: GstVideoVideoFilter, frame: GstVideoVideoFrame) => void;

export async function convertGstVideotransform_frame_ipArgs(data: any): Promise<Parameters<GstVideotransform_frame_ip>> {
  return [
    await GstVideoVideoFilter.create(data.trans.ptr, 'none'),
    await GstVideoVideoFrame.create(data.frame.ptr, 'none')  ];
}
