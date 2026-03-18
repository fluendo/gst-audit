
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';



export type GstBasepeek_next_sample = (aggregator: GstBaseAggregator, aggregator_pad: GstBaseAggregatorPad) => void;

export async function convertGstBasepeek_next_sampleArgs(data: any): Promise<Parameters<GstBasepeek_next_sample>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBaseAggregatorPad.create(data.aggregator_pad.ptr, 'none')  ];
}
