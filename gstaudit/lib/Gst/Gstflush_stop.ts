
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferPool } from './GstBufferPool';



export type Gstflush_stop = (pool: GstBufferPool) => void;

export async function convertGstflush_stopArgs(data: any): Promise<Parameters<Gstflush_stop>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none')  ];
}
