
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from './GObjectParamSpec';
import { GObjectValue } from './GObjectValue';



export type GObjectvalues_cmp = (pspec: GObjectParamSpec, value1: GObjectValue, value2: GObjectValue) => void;

export async function convertGObjectvalues_cmpArgs(data: any): Promise<Parameters<GObjectvalues_cmp>> {
  return [
    await GObjectParamSpec.create(data.pspec.ptr, 'none'),
    await GObjectValue.create(data.value1.ptr, 'none'),
    await GObjectValue.create(data.value2.ptr, 'none')  ];
}
