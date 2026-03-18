
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstElement } from './GstElement';



export type Gstelement_added = (bin: GstBin, child: GstElement) => void;

export async function convertGstelement_addedArgs(data: any): Promise<Parameters<Gstelement_added>> {
  return [
    await GstBin.create(data.bin.ptr, 'none'),
    await GstElement.create(data.child.ptr, 'none')  ];
}
