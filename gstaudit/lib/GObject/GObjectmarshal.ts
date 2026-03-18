
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectClosure } from './GObjectClosure';
import { GObjectValue } from './GObjectValue';



export type GObjectmarshal = (closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint: Pointer, marshal_data: Pointer) => void;

export async function convertGObjectmarshalArgs(data: any): Promise<Parameters<GObjectmarshal>> {
  return [
    await GObjectClosure.create(data.closure.ptr, 'none'),
    await GObjectValue.create(data.return_value.ptr, 'none'),
    data.n_param_values,
    await GObjectValue.create(data.param_values.ptr, 'none'),
    data.invocation_hint,
    data.marshal_data  ];
}
