
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstEvent } from '../Gst/GstEvent';



export type GstBasesink_event_pre_queue = (aggregator: GstBaseAggregator, aggregator_pad: GstBaseAggregatorPad, event: GstEvent) => void;

export async function convertGstBasesink_event_pre_queueArgs(data: any): Promise<Parameters<GstBasesink_event_pre_queue>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBaseAggregatorPad.create(data.aggregator_pad.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none')  ];
}
