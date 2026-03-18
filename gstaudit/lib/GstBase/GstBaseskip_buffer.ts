
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseskip_buffer = (aggpad: GstBaseAggregatorPad, aggregator: GstBaseAggregator, buffer: GstBuffer) => void;

export async function convertGstBaseskip_bufferArgs(data: any): Promise<Parameters<GstBaseskip_buffer>> {
  return [
    await GstBaseAggregatorPad.create(data.aggpad.ptr, 'none'),
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
