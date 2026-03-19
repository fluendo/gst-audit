
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideostop = (decoder: GstVideoVideoDecoder) => void;

export async function convertGstVideostopArgs(data: any): Promise<Parameters<GstVideostop>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none')  ];
}
