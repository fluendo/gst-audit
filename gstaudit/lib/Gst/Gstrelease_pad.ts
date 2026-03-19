
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type Gstrelease_pad = (element: GstElement, pad: GstPad) => void;

export async function convertGstrelease_padArgs(data: any): Promise<Parameters<Gstrelease_pad>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none')  ];
}
