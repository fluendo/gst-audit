
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstElement } from './GstElement';



export type Gstdeep_element_removed = (bin: GstBin, sub_bin: GstBin, child: GstElement) => void;

export async function convertGstdeep_element_removedArgs(data: any): Promise<Parameters<Gstdeep_element_removed>> {
  return [
    await GstBin.create(data.bin.ptr, 'none'),
    await GstBin.create(data.sub_bin.ptr, 'none'),
    await GstElement.create(data.child.ptr, 'none')  ];
}
