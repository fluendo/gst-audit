
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibCompletionFunc = (item: Pointer) => void;

export async function convertGLibCompletionFuncArgs(data: any): Promise<Parameters<GLibCompletionFunc>> {
  return [
    data.item  ];
}
