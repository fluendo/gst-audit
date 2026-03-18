
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibCompareFunc = (a: Pointer, b: Pointer) => void;

export async function convertGLibCompareFuncArgs(data: any): Promise<Parameters<GLibCompareFunc>> {
  return [
    data.a,
    data.b  ];
}
