
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibrealloc = (mem: Pointer, n_bytes: number) => void;

export async function convertGLibreallocArgs(data: any): Promise<Parameters<GLibrealloc>> {
  return [
    data.mem,
    data.n_bytes  ];
}
