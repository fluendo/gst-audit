
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasetransform_ip = (trans: GstBaseBaseTransform, buf: GstBuffer) => void;

export async function convertGstBasetransform_ipArgs(data: any): Promise<Parameters<GstBasetransform_ip>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.buf.ptr, 'none')  ];
}
