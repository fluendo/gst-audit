
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstClock } from './GstClock';
import { GstElement } from './GstElement';



export type Gstset_clock = (element: GstElement, clock: GstClock) => void;

export async function convertGstset_clockArgs(data: any): Promise<Parameters<Gstset_clock>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstClock.create(data.clock.ptr, 'none')  ];
}
