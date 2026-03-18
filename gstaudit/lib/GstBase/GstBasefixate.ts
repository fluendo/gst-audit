
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstCaps } from '../Gst/GstCaps';



export type GstBasefixate = (sink: GstBaseBaseSink, caps: GstCaps) => void;

export async function convertGstBasefixateArgs(data: any): Promise<Parameters<GstBasefixate>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
