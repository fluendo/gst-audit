
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';
import { GstClockEntry } from './GstClockEntry';



export type Gstwait_async = (clock: GstClock, entry: GstClockEntry) => void;

export async function convertGstwait_asyncArgs(data: any): Promise<Parameters<Gstwait_async>> {
  return [
    await GstClock.create(data.clock.ptr, 'none'),
    await GstClockEntry.create(data.entry.ptr, 'none')  ];
}
