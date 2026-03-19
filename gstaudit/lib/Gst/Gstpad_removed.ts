
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type Gstpad_removed = (element: GstElement, pad: GstPad) => void;

export async function convertGstpad_removedArgs(data: any): Promise<Parameters<Gstpad_removed>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none')  ];
}
