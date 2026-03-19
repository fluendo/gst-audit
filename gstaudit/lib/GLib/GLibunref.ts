
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibunref = (cb_data: Pointer) => void;

export async function convertGLibunrefArgs(data: any): Promise<Parameters<GLibunref>> {
  return [
    data.cb_data  ];
}
