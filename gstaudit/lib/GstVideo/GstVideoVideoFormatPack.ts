
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoChromaSite } from './GstVideoVideoChromaSite';
import type { GstVideoVideoChromaSiteValue } from './GstVideoVideoChromaSite';
import { GstVideoVideoFormatInfo } from './GstVideoVideoFormatInfo';
import { GstVideoVideoPackFlags } from './GstVideoVideoPackFlags';
import type { GstVideoVideoPackFlagsValue } from './GstVideoVideoPackFlags';



export type GstVideoVideoFormatPack = (info: GstVideoVideoFormatInfo, flags: GstVideoVideoPackFlagsValue, src: Pointer, sstride: number, data_: Pointer, stride: number, chroma_site: GstVideoVideoChromaSiteValue, y: number, width: number) => void;

export async function convertGstVideoVideoFormatPackArgs(data: any): Promise<Parameters<GstVideoVideoFormatPack>> {
  return [
    await GstVideoVideoFormatInfo.create(data.info.ptr, 'none'),
    data.flags,
    data.src,
    data.sstride,
    data.data,
    data.stride,
    data.chroma_site,
    data.y,
    data.width  ];
}
