
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibThreadFunc = (data_: Pointer) => void;

export async function convertGLibThreadFuncArgs(data: any): Promise<Parameters<GLibThreadFunc>> {
  return [
    data.data  ];
}
