
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';



export type Gstget_internal_time = (clock: GstClock) => void;

export async function convertGstget_internal_timeArgs(data: any): Promise<Parameters<Gstget_internal_time>> {
  return [
    await GstClock.create(data.clock.ptr, 'none')  ];
}
