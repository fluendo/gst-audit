
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GObjectBoxedCopyFunc = (boxed: Pointer) => void;

export async function convertGObjectBoxedCopyFuncArgs(data: any): Promise<Parameters<GObjectBoxedCopyFunc>> {
  return [
    data.boxed  ];
}
