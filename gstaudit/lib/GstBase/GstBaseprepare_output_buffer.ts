
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseprepare_output_buffer = (trans: GstBaseBaseTransform, input: GstBuffer) => void;

export async function convertGstBaseprepare_output_bufferArgs(data: any): Promise<Parameters<GstBaseprepare_output_buffer>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstBuffer.create(data.input.ptr, 'none')  ];
}
