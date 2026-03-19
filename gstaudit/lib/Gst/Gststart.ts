
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferPool } from './GstBufferPool';



export type Gststart = (pool: GstBufferPool) => void;

export async function convertGststartArgs(data: any): Promise<Parameters<Gststart>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none')  ];
}
