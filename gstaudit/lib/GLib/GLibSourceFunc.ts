
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibSourceFunc = (user_data: Pointer) => void;

export async function convertGLibSourceFuncArgs(data: any): Promise<Parameters<GLibSourceFunc>> {
  return [
    data.user_data  ];
}
