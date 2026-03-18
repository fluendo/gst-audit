
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GObjectBoxedFreeFunc = (boxed: Pointer) => void;

export async function convertGObjectBoxedFreeFuncArgs(data: any): Promise<Parameters<GObjectBoxedFreeFunc>> {
  return [
    data.boxed  ];
}
