
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';



export type GstBaseget_next_time = (aggregator: GstBaseAggregator) => void;

export async function convertGstBaseget_next_timeArgs(data: any): Promise<Parameters<GstBaseget_next_time>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none')  ];
}
