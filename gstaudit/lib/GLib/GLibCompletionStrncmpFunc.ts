
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibCompletionStrncmpFunc = (s1: string, s2: string, n: number) => void;

export async function convertGLibCompletionStrncmpFuncArgs(data: any): Promise<Parameters<GLibCompletionStrncmpFunc>> {
  return [
    data.s1,
    data.s2,
    data.n  ];
}
