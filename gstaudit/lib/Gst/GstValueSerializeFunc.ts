
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstValueSerializeFunc = (value1: GObjectValue) => void;

export async function convertGstValueSerializeFuncArgs(data: any): Promise<Parameters<GstValueSerializeFunc>> {
  return [
    await GObjectValue.create(data.value1.ptr, 'none')  ];
}
