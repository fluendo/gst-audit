
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMapFlags } from '../Gst/GstMapFlags';
import type { GstMapFlagsValue } from '../Gst/GstMapFlags';
import { GstMapInfo } from '../Gst/GstMapInfo';
import { GstVideoVideoMeta } from './GstVideoVideoMeta';



export type GstVideomap = (meta: GstVideoVideoMeta, plane: number, info: GstMapInfo, data_: Pointer, stride: number, flags: GstMapFlagsValue) => void;

export async function convertGstVideomapArgs(data: any): Promise<Parameters<GstVideomap>> {
  return [
    await GstVideoVideoMeta.create(data.meta.ptr, 'none'),
    data.plane,
    await GstMapInfo.create(data.info.ptr, 'none'),
    data.data,
    data.stride,
    data.flags  ];
}
