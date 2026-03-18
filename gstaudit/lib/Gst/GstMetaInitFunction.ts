
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstMeta } from './GstMeta';



export type GstMetaInitFunction = (meta: GstMeta, params: Pointer, buffer: GstBuffer) => void;

export async function convertGstMetaInitFunctionArgs(data: any): Promise<Parameters<GstMetaInitFunction>> {
  return [
    await GstMeta.create(data.meta.ptr, 'none'),
    data.params,
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
