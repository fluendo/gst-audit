
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTaskPool } from './GstTaskPool';
import type { GstTaskPoolFunction } from './GstTaskPoolFunction';
import { convertGstTaskPoolFunctionArgs } from './GstTaskPoolFunction';



export type Gstpush = (pool: GstTaskPool, func: GstTaskPoolFunction, user_data: Pointer) => void;

export async function convertGstpushArgs(data: any): Promise<Parameters<Gstpush>> {
  return [
    await GstTaskPool.create(data.pool.ptr, 'none'),
    data.func,
    data.user_data  ];
}
