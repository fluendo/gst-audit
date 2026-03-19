
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibHRFunc = (key: Pointer, value_: Pointer, user_data: Pointer) => void;

export async function convertGLibHRFuncArgs(data: any): Promise<Parameters<GLibHRFunc>> {
  return [
    data.key,
    data.value,
    data.user_data  ];
}
