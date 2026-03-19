
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstElement } from './GstElement';



export type Gstremove_element = (bin: GstBin, element: GstElement) => void;

export async function convertGstremove_elementArgs(data: any): Promise<Parameters<Gstremove_element>> {
  return [
    await GstBin.create(data.bin.ptr, 'none'),
    await GstElement.create(data.element.ptr, 'none')  ];
}
