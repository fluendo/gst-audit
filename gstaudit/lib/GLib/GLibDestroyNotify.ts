
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibDestroyNotify = (data_: Pointer) => void;

export async function convertGLibDestroyNotifyArgs(data: any): Promise<Parameters<GLibDestroyNotify>> {
  return [
    data.data  ];
}
