
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from './GObjectValue';



export type GObjectTypeValueLCopyFunc = (value_: GObjectValue, n_collect_values: number, collect_values: Array<Pointer>, collect_flags: number) => void;

export async function convertGObjectTypeValueLCopyFuncArgs(data: any): Promise<Parameters<GObjectTypeValueLCopyFunc>> {
  return [
    await GObjectValue.create(data.value.ptr, 'none'),
    data.n_collect_values,
    data.collect_values,
    data.collect_flags  ];
}
