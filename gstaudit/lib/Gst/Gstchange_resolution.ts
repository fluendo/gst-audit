
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';



export type Gstchange_resolution = (clock: GstClock, old_resolution: number, new_resolution: number) => void;

export async function convertGstchange_resolutionArgs(data: any): Promise<Parameters<Gstchange_resolution>> {
  return [
    await GstClock.create(data.clock.ptr, 'none'),
    data.old_resolution,
    data.new_resolution  ];
}
