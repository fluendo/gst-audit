
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';



export type GstBufferForeachMetaFunc = (buffer: GstBuffer, user_data: Pointer) => void;

export async function convertGstBufferForeachMetaFuncArgs(data: any): Promise<Parameters<GstBufferForeachMetaFunc>> {
  return [
    await GstBuffer.create(data.buffer.ptr, 'none'),
    data.user_data  ];
}
