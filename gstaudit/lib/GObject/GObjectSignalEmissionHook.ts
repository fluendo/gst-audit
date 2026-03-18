
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectSignalInvocationHint } from './GObjectSignalInvocationHint';



export type GObjectSignalEmissionHook = (ihint: GObjectSignalInvocationHint, n_param_values: number, param_values: Array<GObjectValue>, data_: Pointer) => void;

export async function convertGObjectSignalEmissionHookArgs(data: any): Promise<Parameters<GObjectSignalEmissionHook>> {
  return [
    await GObjectSignalInvocationHint.create(data.ihint.ptr, 'none'),
    data.n_param_values,
    data.param_values,
    data.data  ];
}
