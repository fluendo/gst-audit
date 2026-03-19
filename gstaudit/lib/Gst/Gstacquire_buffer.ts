
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferPool } from './GstBufferPool';
import { GstBufferPoolAcquireParams } from './GstBufferPoolAcquireParams';



export type Gstacquire_buffer = (pool: GstBufferPool, params: GstBufferPoolAcquireParams) => void;

export async function convertGstacquire_bufferArgs(data: any): Promise<Parameters<Gstacquire_buffer>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none'),
    await GstBufferPoolAcquireParams.create(data.params.ptr, 'none')  ];
}
