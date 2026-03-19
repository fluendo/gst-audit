
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseDataQueue } from './GstBaseDataQueue';



export type GstBasefull = (queue: GstBaseDataQueue) => void;

export async function convertGstBasefullArgs(data: any): Promise<Parameters<GstBasefull>> {
  return [
    await GstBaseDataQueue.create(data.queue.ptr, 'none')  ];
}
