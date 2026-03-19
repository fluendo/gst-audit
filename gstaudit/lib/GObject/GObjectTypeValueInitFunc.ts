
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from './GObjectValue';



export type GObjectTypeValueInitFunc = (value_: GObjectValue) => void;

export async function convertGObjectTypeValueInitFuncArgs(data: any): Promise<Parameters<GObjectTypeValueInitFunc>> {
  return [
    await GObjectValue.create(data.value.ptr, 'none')  ];
}
