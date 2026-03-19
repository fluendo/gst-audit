
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibTestDataFunc = (user_data: Pointer) => void;

export async function convertGLibTestDataFuncArgs(data: any): Promise<Parameters<GLibTestDataFunc>> {
  return [
    data.user_data  ];
}
