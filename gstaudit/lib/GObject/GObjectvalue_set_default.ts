
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from './GObjectParamSpec';
import { GObjectValue } from './GObjectValue';



export type GObjectvalue_set_default = (pspec: GObjectParamSpec, value_: GObjectValue) => void;

export async function convertGObjectvalue_set_defaultArgs(data: any): Promise<Parameters<GObjectvalue_set_default>> {
  return [
    await GObjectParamSpec.create(data.pspec.ptr, 'none'),
    await GObjectValue.create(data.value.ptr, 'none')  ];
}
