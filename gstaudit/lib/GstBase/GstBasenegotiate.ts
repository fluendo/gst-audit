
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';



export type GstBasenegotiate = (self: GstBaseAggregator) => void;

export async function convertGstBasenegotiateArgs(data: any): Promise<Parameters<GstBasenegotiate>> {
  return [
    await GstBaseAggregator.create(data.self.ptr, 'none')  ];
}
