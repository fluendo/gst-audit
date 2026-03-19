
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferPool } from './GstBufferPool';
import { GstStructure } from './GstStructure';



export type Gstset_config = (pool: GstBufferPool, config: GstStructure) => void;

export async function convertGstset_configArgs(data: any): Promise<Parameters<Gstset_config>> {
  return [
    await GstBufferPool.create(data.pool.ptr, 'none'),
    await GstStructure.create(data.config.ptr, 'full')  ];
}
