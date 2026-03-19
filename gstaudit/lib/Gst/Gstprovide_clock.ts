
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';



export type Gstprovide_clock = (element: GstElement) => void;

export async function convertGstprovide_clockArgs(data: any): Promise<Parameters<Gstprovide_clock>> {
  return [
    await GstElement.create(data.element.ptr, 'none')  ];
}
