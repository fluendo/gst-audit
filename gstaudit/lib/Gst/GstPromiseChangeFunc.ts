
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPromise } from './GstPromise';



export type GstPromiseChangeFunc = (promise: GstPromise, user_data: Pointer) => void;

export async function convertGstPromiseChangeFuncArgs(data: any): Promise<Parameters<GstPromiseChangeFunc>> {
  return [
    await GstPromise.create(data.promise.ptr, 'none'),
    data.user_data  ];
}
