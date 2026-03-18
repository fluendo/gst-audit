
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseprepare = (sink: GstBaseBaseSink, buffer: GstBuffer) => void;

export async function convertGstBaseprepareArgs(data: any): Promise<Parameters<GstBaseprepare>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
