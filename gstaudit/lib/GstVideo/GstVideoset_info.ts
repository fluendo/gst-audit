
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from '../Gst/GstCaps';
import { GstVideoVideoFilter } from './GstVideoVideoFilter';
import { GstVideoVideoInfo } from './GstVideoVideoInfo';



export type GstVideoset_info = (filter: GstVideoVideoFilter, incaps: GstCaps, in_info: GstVideoVideoInfo, outcaps: GstCaps, out_info: GstVideoVideoInfo) => void;

export async function convertGstVideoset_infoArgs(data: any): Promise<Parameters<GstVideoset_info>> {
  return [
    await GstVideoVideoFilter.create(data.filter.ptr, 'none'),
    await GstCaps.create(data.incaps.ptr, 'none'),
    await GstVideoVideoInfo.create(data.in_info.ptr, 'none'),
    await GstCaps.create(data.outcaps.ptr, 'none'),
    await GstVideoVideoInfo.create(data.out_info.ptr, 'none')  ];
}
