
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstValueDeserializeFunc = (dest: GObjectValue, s: string) => void;

export async function convertGstValueDeserializeFuncArgs(data: any): Promise<Parameters<GstValueDeserializeFunc>> {
  return [
    await GObjectValue.create(data.dest.ptr, 'none'),
    data.s  ];
}
