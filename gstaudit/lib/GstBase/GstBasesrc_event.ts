
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstEvent } from '../Gst/GstEvent';



export type GstBasesrc_event = (aggregator: GstBaseAggregator, event: GstEvent) => void;

export async function convertGstBasesrc_eventArgs(data: any): Promise<Parameters<GstBasesrc_event>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none')  ];
}
