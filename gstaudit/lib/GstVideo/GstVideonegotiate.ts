
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideonegotiate = (decoder: GstVideoVideoDecoder) => void;

export async function convertGstVideonegotiateArgs(data: any): Promise<Parameters<GstVideonegotiate>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none')  ];
}
