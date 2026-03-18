
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibHFunc = (key: Pointer, value_: Pointer, user_data: Pointer) => void;

export async function convertGLibHFuncArgs(data: any): Promise<Parameters<GLibHFunc>> {
  return [
    data.key,
    data.value,
    data.user_data  ];
}
