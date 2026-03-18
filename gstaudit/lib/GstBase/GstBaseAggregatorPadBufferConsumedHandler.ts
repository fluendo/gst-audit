
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregatorPad } from './GstBaseAggregatorPad';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseAggregatorPadBufferConsumedHandler = (self: GstBaseAggregatorPad, object: GstBuffer) => void;

export async function convertGstBaseAggregatorPadBufferConsumedHandlerArgs(data: any): Promise<Parameters<GstBaseAggregatorPadBufferConsumedHandler>> {
  return [
    await GstBaseAggregatorPad.create(data.self.ptr, 'none'),
    await GstBuffer.create(data.object.ptr, 'none')  ];
}
