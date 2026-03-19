
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasefill = (src: GstBaseBaseSrc, offset: number, size: number, buf: GstBuffer) => void;

export async function convertGstBasefillArgs(data: any): Promise<Parameters<GstBasefill>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none'),
    data.offset,
    data.size,
    await GstBuffer.create(data.buf.ptr, 'none')  ];
}
