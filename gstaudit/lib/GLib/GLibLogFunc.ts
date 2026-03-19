
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GLibLogLevelFlags } from './GLibLogLevelFlags';



export type GLibLogFunc = (log_domain: string, log_level: GLibLogLevelFlags, message: string, user_data: Pointer) => void;

export async function convertGLibLogFuncArgs(data: any): Promise<Parameters<GLibLogFunc>> {
  return [
    data.log_domain,
    data.log_level,
    data.message,
    data.user_data  ];
}
