
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideoflush = (decoder: GstVideoVideoDecoder) => void;

export async function convertGstVideoflushArgs(data: any): Promise<Parameters<GstVideoflush>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none')  ];
}
