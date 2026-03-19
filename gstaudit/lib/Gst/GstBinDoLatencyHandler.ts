
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';



export type GstBinDoLatencyHandler = (self: GstBin) => void;

export async function convertGstBinDoLatencyHandlerArgs(data: any): Promise<Parameters<GstBinDoLatencyHandler>> {
  return [
    await GstBin.create(data.self.ptr, 'none')  ];
}
