
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoCodecFrame } from './GstVideoVideoCodecFrame';
import { GstVideoVideoEncoder } from './GstVideoVideoEncoder';



export type GstVideopre_push = (encoder: GstVideoVideoEncoder, frame: GstVideoVideoCodecFrame) => void;

export async function convertGstVideopre_pushArgs(data: any): Promise<Parameters<GstVideopre_push>> {
  return [
    await GstVideoVideoEncoder.create(data.encoder.ptr, 'none'),
    await GstVideoVideoCodecFrame.create(data.frame.ptr, 'none')  ];
}
