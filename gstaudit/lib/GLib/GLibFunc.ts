
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibFunc = (data_: Pointer, user_data: Pointer) => void;

export async function convertGLibFuncArgs(data: any): Promise<Parameters<GLibFunc>> {
  return [
    data.data,
    data.user_data  ];
}
