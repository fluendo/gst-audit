
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTaskPool } from './GstTaskPool';



export type Gstcleanup = (pool: GstTaskPool) => void;

export async function convertGstcleanupArgs(data: any): Promise<Parameters<Gstcleanup>> {
  return [
    await GstTaskPool.create(data.pool.ptr, 'none')  ];
}
