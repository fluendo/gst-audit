
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectClosure } from './GObjectClosure';
import { GObjectValue } from './GObjectValue';



export type GObjectClosureMarshal = (closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: Array<GObjectValue>, invocation_hint: Pointer, marshal_data: Pointer) => void;

export async function convertGObjectClosureMarshalArgs(data: any): Promise<Parameters<GObjectClosureMarshal>> {
  return [
    await GObjectClosure.create(data.closure.ptr, 'none'),
    await GObjectValue.create(data.return_value.ptr, 'none'),
    data.n_param_values,
    data.param_values,
    data.invocation_hint,
    data.marshal_data  ];
}
