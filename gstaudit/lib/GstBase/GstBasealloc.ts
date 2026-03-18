
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';



export type GstBasealloc = (src: GstBaseBaseSrc, offset: number, size: number) => void;

export async function convertGstBaseallocArgs(data: any): Promise<Parameters<GstBasealloc>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none'),
    data.offset,
    data.size  ];
}
