
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseclip = (aggregator: GstBaseAggregator, aggregator_pad: GstBaseAggregatorPad, buf: GstBuffer) => void;

export async function convertGstBaseclipArgs(data: any): Promise<Parameters<GstBaseclip>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBaseAggregatorPad.create(data.aggregator_pad.ptr, 'none'),
    await GstBuffer.create(data.buf.ptr, 'none')  ];
}
