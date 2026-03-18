
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoFormatInfo } from './GstVideoVideoFormatInfo';
import { GstVideoVideoPackFlags } from './GstVideoVideoPackFlags';
import type { GstVideoVideoPackFlagsValue } from './GstVideoVideoPackFlags';



export type GstVideoVideoFormatUnpack = (info: GstVideoVideoFormatInfo, flags: GstVideoVideoPackFlagsValue, dest: Pointer, data_: Pointer, stride: number, x: number, y: number, width: number) => void;

export async function convertGstVideoVideoFormatUnpackArgs(data: any): Promise<Parameters<GstVideoVideoFormatUnpack>> {
  return [
    await GstVideoVideoFormatInfo.create(data.info.ptr, 'none'),
    data.flags,
    data.dest,
    data.data,
    data.stride,
    data.x,
    data.y,
    data.width  ];
}
