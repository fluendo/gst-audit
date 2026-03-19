
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibVoidFunc = () => void;

export async function convertGLibVoidFuncArgs(data: any): Promise<Parameters<GLibVoidFunc>> {
  return [
  ];
}
