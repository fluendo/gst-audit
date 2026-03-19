
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstCustomMeta } from './GstCustomMeta';



export type GstCustomMetaTransformFunction = (transbuf: GstBuffer, meta: GstCustomMeta, buffer: GstBuffer, type_: number, data_: Pointer, user_data: Pointer) => void;

export async function convertGstCustomMetaTransformFunctionArgs(data: any): Promise<Parameters<GstCustomMetaTransformFunction>> {
  return [
    await GstBuffer.create(data.transbuf.ptr, 'none'),
    await GstCustomMeta.create(data.meta.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none'),
    data.type,
    data.data,
    data.user_data  ];
}
