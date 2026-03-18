
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstMeta } from './GstMeta';



export type GstMetaFreeFunction = (meta: GstMeta, buffer: GstBuffer) => void;

export async function convertGstMetaFreeFunctionArgs(data: any): Promise<Parameters<GstMetaFreeFunction>> {
  return [
    await GstMeta.create(data.meta.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
