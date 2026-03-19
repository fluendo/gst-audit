
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';



export type GstClockCallback = (clock: GstClock, time: number, id: Pointer, user_data: Pointer) => void;

export async function convertGstClockCallbackArgs(data: any): Promise<Parameters<GstClockCallback>> {
  return [
    await GstClock.create(data.clock.ptr, 'none'),
    data.time,
    data.id,
    data.user_data  ];
}
