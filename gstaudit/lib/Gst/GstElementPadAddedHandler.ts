
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type GstElementPadAddedHandler = (self: GstElement, new_pad: GstPad) => void;

export async function convertGstElementPadAddedHandlerArgs(data: any): Promise<Parameters<GstElementPadAddedHandler>> {
  return [
    await GstElement.create(data.self.ptr, 'none'),
    await GstPad.create(data.new_pad.ptr, 'none')  ];
}
