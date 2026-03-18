
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';
import { GLibIOCondition } from './GLibIOCondition';
import type { GLibIOConditionValue } from './GLibIOCondition';



export type GLibIOFunc = (source: GLibIOChannel, condition: GLibIOConditionValue, data_: Pointer) => void;

export async function convertGLibIOFuncArgs(data: any): Promise<Parameters<GLibIOFunc>> {
  return [
    await GLibIOChannel.create(data.source.ptr, 'none'),
    data.condition,
    data.data  ];
}
