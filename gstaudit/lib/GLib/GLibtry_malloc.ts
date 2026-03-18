
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibtry_malloc = (n_bytes: number) => void;

export async function convertGLibtry_mallocArgs(data: any): Promise<Parameters<GLibtry_malloc>> {
  return [
    data.n_bytes  ];
}
