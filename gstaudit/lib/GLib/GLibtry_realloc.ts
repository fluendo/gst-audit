
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibtry_realloc = (mem: Pointer, n_bytes: number) => void;

export async function convertGLibtry_reallocArgs(data: any): Promise<Parameters<GLibtry_realloc>> {
  return [
    data.mem,
    data.n_bytes  ];
}
