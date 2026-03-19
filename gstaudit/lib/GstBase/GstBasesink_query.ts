
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstQuery } from '../Gst/GstQuery';



export type GstBasesink_query = (aggregator: GstBaseAggregator, aggregator_pad: GstBaseAggregatorPad, query: GstQuery) => void;

export async function convertGstBasesink_queryArgs(data: any): Promise<Parameters<GstBasesink_query>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBaseAggregatorPad.create(data.aggregator_pad.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
