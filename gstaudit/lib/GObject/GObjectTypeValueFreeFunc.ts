
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from './GObjectValue';



export type GObjectTypeValueFreeFunc = (value_: GObjectValue) => void;

export async function convertGObjectTypeValueFreeFuncArgs(data: any): Promise<Parameters<GObjectTypeValueFreeFunc>> {
  return [
    await GObjectValue.create(data.value.ptr, 'none')  ];
}
