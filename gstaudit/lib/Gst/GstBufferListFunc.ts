
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GstBufferListFunc = (idx: number, user_data: Pointer) => void;

export async function convertGstBufferListFuncArgs(data: any): Promise<Parameters<GstBufferListFunc>> {
  return [
    data.idx,
    data.user_data  ];
}
