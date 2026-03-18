
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';



export type GstBaseaggregate = (aggregator: GstBaseAggregator, timeout: boolean) => void;

export async function convertGstBaseaggregateArgs(data: any): Promise<Parameters<GstBaseaggregate>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    data.timeout  ];
}
