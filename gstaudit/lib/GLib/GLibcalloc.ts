
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibcalloc = (n_blocks: number, n_block_bytes: number) => void;

export async function convertGLibcallocArgs(data: any): Promise<Parameters<GLibcalloc>> {
  return [
    data.n_blocks,
    data.n_block_bytes  ];
}
