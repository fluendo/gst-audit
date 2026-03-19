
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstStateChange } from './GstStateChange';
import type { GstStateChangeValue } from './GstStateChange';



export type Gstchange_state = (element: GstElement, transition: GstStateChangeValue) => void;

export async function convertGstchange_stateArgs(data: any): Promise<Parameters<Gstchange_state>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    data.transition  ];
}
