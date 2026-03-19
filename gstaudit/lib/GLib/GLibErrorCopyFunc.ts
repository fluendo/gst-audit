
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibErrorCopyFunc = (src_error: Pointer, dest_error: Pointer) => void;

export async function convertGLibErrorCopyFuncArgs(data: any): Promise<Parameters<GLibErrorCopyFunc>> {
  return [
    data.src_error,
    data.dest_error  ];
}
