
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstMeta } from './GstMeta';



export type GstMetaClearFunction = (buffer: GstBuffer, meta: GstMeta) => void;

export async function convertGstMetaClearFunctionArgs(data: any): Promise<Parameters<GstMetaClearFunction>> {
  return [
    await GstBuffer.create(data.buffer.ptr, 'none'),
    await GstMeta.create(data.meta.ptr, 'none')  ];
}
