
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibCompareDataFunc = (a: Pointer, b: Pointer, user_data: Pointer) => void;

export async function convertGLibCompareDataFuncArgs(data: any): Promise<Parameters<GLibCompareDataFunc>> {
  return [
    data.a,
    data.b,
    data.user_data  ];
}
