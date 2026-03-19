
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstMeta } from './GstMeta';



export type GstMetaTransformFunction = (transbuf: GstBuffer, meta: GstMeta, buffer: GstBuffer, type_: number, data_: Pointer) => void;

export async function convertGstMetaTransformFunctionArgs(data: any): Promise<Parameters<GstMetaTransformFunction>> {
  return [
    await GstBuffer.create(data.transbuf.ptr, 'none'),
    await GstMeta.create(data.meta.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none'),
    data.type,
    data.data  ];
}
