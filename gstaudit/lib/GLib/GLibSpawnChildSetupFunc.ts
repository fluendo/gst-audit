
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibSpawnChildSetupFunc = (data_: Pointer) => void;

export async function convertGLibSpawnChildSetupFuncArgs(data: any): Promise<Parameters<GLibSpawnChildSetupFunc>> {
  return [
    data.data  ];
}
