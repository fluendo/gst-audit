
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibErrorClearFunc = (error_: Pointer) => void;

export async function convertGLibErrorClearFuncArgs(data: any): Promise<Parameters<GLibErrorClearFunc>> {
  return [
    data.error  ];
}
