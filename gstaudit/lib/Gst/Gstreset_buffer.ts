
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstBufferPool } from './GstBufferPool';



export type Gstreset_buffer = (pool: GstBufferPool, buffer: GstBuffer) => void;

export async function convertGstreset_bufferArgs(data: any): Promise<Parameters<Gstreset_buffer>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
