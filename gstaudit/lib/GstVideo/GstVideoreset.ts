
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideoreset = (decoder: GstVideoVideoDecoder, hard: boolean) => void;

export async function convertGstVideoresetArgs(data: any): Promise<Parameters<GstVideoreset>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    data.hard  ];
}
