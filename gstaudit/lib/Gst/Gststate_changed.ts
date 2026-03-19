
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstState } from './GstState';
import type { GstStateValue } from './GstState';



export type Gststate_changed = (element: GstElement, oldstate: GstStateValue, newstate: GstStateValue, pending: GstStateValue) => void;

export async function convertGststate_changedArgs(data: any): Promise<Parameters<Gststate_changed>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    data.oldstate,
    data.newstate,
    data.pending  ];
}
