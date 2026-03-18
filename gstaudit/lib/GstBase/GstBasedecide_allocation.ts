
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstQuery } from '../Gst/GstQuery';



export type GstBasedecide_allocation = (self: GstBaseAggregator, query: GstQuery) => void;

export async function convertGstBasedecide_allocationArgs(data: any): Promise<Parameters<GstBasedecide_allocation>> {
  return [
    await GstBaseAggregator.create(data.self.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
