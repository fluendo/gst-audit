
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstEvent } from './GstEvent';



export type Gstsend_event = (element: GstElement, event: GstEvent) => void;

export async function convertGstsend_eventArgs(data: any): Promise<Parameters<Gstsend_event>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'full')  ];
}
