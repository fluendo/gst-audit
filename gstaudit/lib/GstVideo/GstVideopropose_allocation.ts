
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstQuery } from '../Gst/GstQuery';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideopropose_allocation = (decoder: GstVideoVideoDecoder, query: GstQuery) => void;

export async function convertGstVideopropose_allocationArgs(data: any): Promise<Parameters<GstVideopropose_allocation>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
