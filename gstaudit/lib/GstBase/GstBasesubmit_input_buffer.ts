
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasesubmit_input_buffer = (trans: GstBaseBaseTransform, is_discont: boolean, input: GstBuffer) => void;

export async function convertGstBasesubmit_input_bufferArgs(data: any): Promise<Parameters<GstBasesubmit_input_buffer>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    data.is_discont,
    await GstBuffer.create(data.input.ptr, 'none')  ];
}
