
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from '../Gst/GstCaps';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideogetcaps = (decoder: GstVideoVideoDecoder, filter: GstCaps) => void;

export async function convertGstVideogetcapsArgs(data: any): Promise<Parameters<GstVideogetcaps>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstCaps.create(data.filter.ptr, 'none')  ];
}
