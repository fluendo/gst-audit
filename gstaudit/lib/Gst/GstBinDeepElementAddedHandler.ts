
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstElement } from './GstElement';



export type GstBinDeepElementAddedHandler = (self: GstBin, sub_bin: GstBin, element: GstElement) => void;

export async function convertGstBinDeepElementAddedHandlerArgs(data: any): Promise<Parameters<GstBinDeepElementAddedHandler>> {
  return [
    await GstBin.create(data.self.ptr, 'none'),
    await GstBin.create(data.sub_bin.ptr, 'none'),
    await GstElement.create(data.element.ptr, 'none')  ];
}
