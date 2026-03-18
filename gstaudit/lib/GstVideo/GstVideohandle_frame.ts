
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoCodecFrame } from './GstVideoVideoCodecFrame';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideohandle_frame = (decoder: GstVideoVideoDecoder, frame: GstVideoVideoCodecFrame) => void;

export async function convertGstVideohandle_frameArgs(data: any): Promise<Parameters<GstVideohandle_frame>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstVideoVideoCodecFrame.create(data.frame.ptr, 'full')  ];
}
