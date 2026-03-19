
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';



export type Gstget_state = (element: GstElement, timeout: number) => void;

export async function convertGstget_stateArgs(data: any): Promise<Parameters<Gstget_state>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    data.timeout  ];
}
