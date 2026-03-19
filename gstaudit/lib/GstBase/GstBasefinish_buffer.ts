
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasefinish_buffer = (aggregator: GstBaseAggregator, buffer: GstBuffer) => void;

export async function convertGstBasefinish_bufferArgs(data: any): Promise<Parameters<GstBasefinish_buffer>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'full')  ];
}
