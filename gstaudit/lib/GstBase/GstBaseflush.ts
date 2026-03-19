
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';



export type GstBaseflush = (aggregator: GstBaseAggregator) => void;

export async function convertGstBaseflushArgs(data: any): Promise<Parameters<GstBaseflush>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none')  ];
}
