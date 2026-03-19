
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type Gstpad_added = (element: GstElement, pad: GstPad) => void;

export async function convertGstpad_addedArgs(data: any): Promise<Parameters<Gstpad_added>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none')  ];
}
