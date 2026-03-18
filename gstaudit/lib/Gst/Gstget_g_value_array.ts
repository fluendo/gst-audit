
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstControlBinding } from './GstControlBinding';



export type Gstget_g_value_array = (binding: GstControlBinding, interval: number, n_values: number, values: Array<GObjectValue>) => void;

export async function convertGstget_g_value_arrayArgs(data: any): Promise<Parameters<Gstget_g_value_array>> {
  return [
    await GstControlBinding.create(data.binding.ptr, 'none'),
    data.interval,
    data.n_values,
    data.values  ];
}
