
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectClosure } from './GObjectClosure';



export type GObjectClosureNotify = (data_: Pointer, closure: GObjectClosure) => void;

export async function convertGObjectClosureNotifyArgs(data: any): Promise<Parameters<GObjectClosureNotify>> {
  return [
    data.data,
    await GObjectClosure.create(data.closure.ptr, 'none')  ];
}
