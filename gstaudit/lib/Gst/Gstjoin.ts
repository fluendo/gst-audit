
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTaskPool } from './GstTaskPool';



export type Gstjoin = (pool: GstTaskPool, id: Pointer) => void;

export async function convertGstjoinArgs(data: any): Promise<Parameters<Gstjoin>> {
  return [
    await GstTaskPool.create(data.pool.ptr, 'none'),
    data.id  ];
}
