
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibref = (cb_data: Pointer) => void;

export async function convertGLibrefArgs(data: any): Promise<Parameters<GLibref>> {
  return [
    data.cb_data  ];
}
