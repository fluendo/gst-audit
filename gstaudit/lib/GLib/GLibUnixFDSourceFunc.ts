
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOCondition } from './GLibIOCondition';
import type { GLibIOConditionValue } from './GLibIOCondition';



export type GLibUnixFDSourceFunc = (fd: number, condition: GLibIOConditionValue, user_data: Pointer) => void;

export async function convertGLibUnixFDSourceFuncArgs(data: any): Promise<Parameters<GLibUnixFDSourceFunc>> {
  return [
    data.fd,
    data.condition,
    data.user_data  ];
}
