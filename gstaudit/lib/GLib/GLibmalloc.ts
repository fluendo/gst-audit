
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibmalloc = (n_bytes: number) => void;

export async function convertGLibmallocArgs(data: any): Promise<Parameters<GLibmalloc>> {
  return [
    data.n_bytes  ];
}
