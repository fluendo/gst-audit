
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstQuery } from '../Gst/GstQuery';



export type GstBasepropose_allocation = (self: GstBaseAggregator, pad: GstBaseAggregatorPad, decide_query: GstQuery, query: GstQuery) => void;

export async function convertGstBasepropose_allocationArgs(data: any): Promise<Parameters<GstBasepropose_allocation>> {
  return [
    await GstBaseAggregator.create(data.self.ptr, 'none'),
    await GstBaseAggregatorPad.create(data.pad.ptr, 'none'),
    await GstQuery.create(data.decide_query.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
