
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';



export type GstBaseis_seekable = (src: GstBaseBaseSrc) => void;

export async function convertGstBaseis_seekableArgs(data: any): Promise<Parameters<GstBaseis_seekable>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none')  ];
}
