
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibChildWatchFunc = (pid: number, wait_status: number, user_data: Pointer) => void;

export async function convertGLibChildWatchFuncArgs(data: any): Promise<Parameters<GLibChildWatchFunc>> {
  return [
    data.pid,
    data.wait_status,
    data.user_data  ];
}
