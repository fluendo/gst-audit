
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';
import { GstMeta } from '../Gst/GstMeta';



export type GstBasetransform_meta = (trans: GstBaseBaseTransform, outbuf: GstBuffer, meta: GstMeta, inbuf: GstBuffer) => void;

export async function convertGstBasetransform_metaArgs(data: any): Promise<Parameters<GstBasetransform_meta>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.outbuf.ptr, 'none'),
    await GstMeta.create(data.meta.ptr, 'none'),
    await GstBuffer.create(data.inbuf.ptr, 'none')  ];
}
