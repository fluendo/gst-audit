
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBus } from './GstBus';
import { GstElement } from './GstElement';



export type Gstset_bus = (element: GstElement, bus: GstBus) => void;

export async function convertGstset_busArgs(data: any): Promise<Parameters<Gstset_bus>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstBus.create(data.bus.ptr, 'none')  ];
}
