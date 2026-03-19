
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoFilter } from './GstVideoVideoFilter';
import { GstVideoVideoFrame } from './GstVideoVideoFrame';



export type GstVideotransform_frame = (filter: GstVideoVideoFilter, inframe: GstVideoVideoFrame, outframe: GstVideoVideoFrame) => void;

export async function convertGstVideotransform_frameArgs(data: any): Promise<Parameters<GstVideotransform_frame>> {
  return [
    await GstVideoVideoFilter.create(data.filter.ptr, 'none'),
    await GstVideoVideoFrame.create(data.inframe.ptr, 'none'),
    await GstVideoVideoFrame.create(data.outframe.ptr, 'none')  ];
}
