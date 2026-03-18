
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GObjectValue } from '../GObject/GObjectValue';



export type GstValueDeserializeWithPSpecFunc = (dest: GObjectValue, s: string, pspec: GObjectParamSpec) => void;

export async function convertGstValueDeserializeWithPSpecFuncArgs(data: any): Promise<Parameters<GstValueDeserializeWithPSpecFunc>> {
  return [
    await GObjectValue.create(data.dest.ptr, 'none'),
    data.s,
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
