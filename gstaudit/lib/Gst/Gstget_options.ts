
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferPool } from './GstBufferPool';



export type Gstget_options = (pool: GstBufferPool) => void;

export async function convertGstget_optionsArgs(data: any): Promise<Parameters<Gstget_options>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none')  ];
}
