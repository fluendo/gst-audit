
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstValueCompareFunc = (value1: GObjectValue, value2: GObjectValue) => void;

export async function convertGstValueCompareFuncArgs(data: any): Promise<Parameters<GstValueCompareFunc>> {
  return [
    await GObjectValue.create(data.value1.ptr, 'none'),
    await GObjectValue.create(data.value2.ptr, 'none')  ];
}
