
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstElement } from './GstElement';



export type GstBinElementRemovedHandler = (self: GstBin, element: GstElement) => void;

export async function convertGstBinElementRemovedHandlerArgs(data: any): Promise<Parameters<GstBinElementRemovedHandler>> {
  return [
    await GstBin.create(data.self.ptr, 'none'),
    await GstElement.create(data.element.ptr, 'none')  ];
}
