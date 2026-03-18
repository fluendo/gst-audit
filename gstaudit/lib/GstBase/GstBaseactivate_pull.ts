
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';



export type GstBaseactivate_pull = (sink: GstBaseBaseSink, active: boolean) => void;

export async function convertGstBaseactivate_pullArgs(data: any): Promise<Parameters<GstBaseactivate_pull>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    data.active  ];
}
