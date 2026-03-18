
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAdapter } from '../GstBase/GstBaseAdapter';
import { GstVideoVideoCodecFrame } from './GstVideoVideoCodecFrame';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideoparse = (decoder: GstVideoVideoDecoder, frame: GstVideoVideoCodecFrame, adapter: GstBaseAdapter, at_eos: boolean) => void;

export async function convertGstVideoparseArgs(data: any): Promise<Parameters<GstVideoparse>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstVideoVideoCodecFrame.create(data.frame.ptr, 'none'),
    await GstBaseAdapter.create(data.adapter.ptr, 'none'),
    data.at_eos  ];
}
