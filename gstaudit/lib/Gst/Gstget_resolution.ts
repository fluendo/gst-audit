
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';



export type Gstget_resolution = (clock: GstClock) => void;

export async function convertGstget_resolutionArgs(data: any): Promise<Parameters<Gstget_resolution>> {
  return [
    await GstClock.create(data.clock.ptr, 'none')  ];
}
