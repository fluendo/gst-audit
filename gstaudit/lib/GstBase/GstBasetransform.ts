
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasetransform = (trans: GstBaseBaseTransform, inbuf: GstBuffer, outbuf: GstBuffer) => void;

export async function convertGstBasetransformArgs(data: any): Promise<Parameters<GstBasetransform>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.inbuf.ptr, 'none'),
    await GstBuffer.create(data.outbuf.ptr, 'none')  ];
}
