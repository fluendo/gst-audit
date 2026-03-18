
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstCaps } from '../Gst/GstCaps';



export type GstBasefixate_src_caps = (self: GstBaseAggregator, caps: GstCaps) => void;

export async function convertGstBasefixate_src_capsArgs(data: any): Promise<Parameters<GstBasefixate_src_caps>> {
  return [
    await GstBaseAggregator.create(data.self.ptr, 'none'),
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
