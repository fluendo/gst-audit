
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';



export type GstClockSyncedHandler = (self: GstClock, synced: boolean) => void;

export async function convertGstClockSyncedHandlerArgs(data: any): Promise<Parameters<GstClockSyncedHandler>> {
  return [
    await GstClock.create(data.self.ptr, 'none'),
    data.synced  ];
}
