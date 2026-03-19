
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';



export type GstBaseget_size = (src: GstBaseBaseSrc) => void;

export async function convertGstBaseget_sizeArgs(data: any): Promise<Parameters<GstBaseget_size>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none')  ];
}
