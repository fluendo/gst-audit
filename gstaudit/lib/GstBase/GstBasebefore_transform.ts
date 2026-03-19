
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasebefore_transform = (trans: GstBaseBaseTransform, buffer: GstBuffer) => void;

export async function convertGstBasebefore_transformArgs(data: any): Promise<Parameters<GstBasebefore_transform>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
