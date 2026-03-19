
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';



export type Gstdo_latency = (bin: GstBin) => void;

export async function convertGstdo_latencyArgs(data: any): Promise<Parameters<Gstdo_latency>> {
  return [
    await GstBin.create(data.bin.ptr, 'none')  ];
}
