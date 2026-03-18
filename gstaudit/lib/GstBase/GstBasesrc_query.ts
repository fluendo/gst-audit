
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstQuery } from '../Gst/GstQuery';



export type GstBasesrc_query = (aggregator: GstBaseAggregator, query: GstQuery) => void;

export async function convertGstBasesrc_queryArgs(data: any): Promise<Parameters<GstBasesrc_query>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
