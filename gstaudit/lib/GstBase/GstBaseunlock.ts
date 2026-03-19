
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';



export type GstBaseunlock = (sink: GstBaseBaseSink) => void;

export async function convertGstBaseunlockArgs(data: any): Promise<Parameters<GstBaseunlock>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none')  ];
}
