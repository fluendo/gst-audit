
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTaskPool } from './GstTaskPool';



export type Gstdispose_handle = (pool: GstTaskPool, id: Pointer) => void;

export async function convertGstdispose_handleArgs(data: any): Promise<Parameters<Gstdispose_handle>> {
  return [
    await GstTaskPool.create(data.pool.ptr, 'none'),
    data.id  ];
}
