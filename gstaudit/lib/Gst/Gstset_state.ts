
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstState } from './GstState';
import type { GstStateValue } from './GstState';



export type Gstset_state = (element: GstElement, state: GstStateValue) => void;

export async function convertGstset_stateArgs(data: any): Promise<Parameters<Gstset_state>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    data.state  ];
}
