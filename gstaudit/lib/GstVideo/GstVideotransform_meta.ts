
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMeta } from '../Gst/GstMeta';
import { GstVideoVideoCodecFrame } from './GstVideoVideoCodecFrame';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideotransform_meta = (decoder: GstVideoVideoDecoder, frame: GstVideoVideoCodecFrame, meta: GstMeta) => void;

export async function convertGstVideotransform_metaArgs(data: any): Promise<Parameters<GstVideotransform_meta>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstVideoVideoCodecFrame.create(data.frame.ptr, 'none'),
    await GstMeta.create(data.meta.ptr, 'none')  ];
}
