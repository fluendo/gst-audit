
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibTraverseFunc = (key: Pointer, value_: Pointer, data_: Pointer) => void;

export async function convertGLibTraverseFuncArgs(data: any): Promise<Parameters<GLibTraverseFunc>> {
  return [
    data.key,
    data.value,
    data.data  ];
}
