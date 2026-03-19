
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibErrorInitFunc = (error_: Pointer) => void;

export async function convertGLibErrorInitFuncArgs(data: any): Promise<Parameters<GLibErrorInitFunc>> {
  return [
    data.error  ];
}
