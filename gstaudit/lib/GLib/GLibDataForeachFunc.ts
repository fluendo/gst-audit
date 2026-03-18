
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibDataForeachFunc = (key_id: number, data_: Pointer, user_data: Pointer) => void;

export async function convertGLibDataForeachFuncArgs(data: any): Promise<Parameters<GLibDataForeachFunc>> {
  return [
    data.key_id,
    data.data,
    data.user_data  ];
}
