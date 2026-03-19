
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from './GObjectValue';



export type GObjectTypeValueCopyFunc = (src_value: GObjectValue) => void;

export async function convertGObjectTypeValueCopyFuncArgs(data: any): Promise<Parameters<GObjectTypeValueCopyFunc>> {
  return [
    await GObjectValue.create(data.src_value.ptr, 'none')  ];
}
