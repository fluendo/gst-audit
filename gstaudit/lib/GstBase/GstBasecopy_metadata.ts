
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasecopy_metadata = (trans: GstBaseBaseTransform, input: GstBuffer, outbuf: GstBuffer) => void;

export async function convertGstBasecopy_metadataArgs(data: any): Promise<Parameters<GstBasecopy_metadata>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.input.ptr, 'none'),
    await GstBuffer.create(data.outbuf.ptr, 'none')  ];
}
