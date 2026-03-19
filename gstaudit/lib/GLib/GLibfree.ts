
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibfree = (mem: Pointer) => void;

export async function convertGLibfreeArgs(data: any): Promise<Parameters<GLibfree>> {
  return [
    data.mem  ];
}
