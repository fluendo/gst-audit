
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';



export type GstBaseunlock_stop = (sink: GstBaseBaseSink) => void;

export async function convertGstBaseunlock_stopArgs(data: any): Promise<Parameters<GstBaseunlock_stop>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none')  ];
}
