
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type GstElementPadRemovedHandler = (self: GstElement, old_pad: GstPad) => void;

export async function convertGstElementPadRemovedHandlerArgs(data: any): Promise<Parameters<GstElementPadRemovedHandler>> {
  return [
    await GstElement.create(data.self.ptr, 'none'),
    await GstPad.create(data.old_pad.ptr, 'none')  ];
}
