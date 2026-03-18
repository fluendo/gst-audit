
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstCaps } from '../Gst/GstCaps';



export type GstBaseget_caps = (sink: GstBaseBaseSink, filter: GstCaps) => void;

export async function convertGstBaseget_capsArgs(data: any): Promise<Parameters<GstBaseget_caps>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstCaps.create(data.filter.ptr, 'none')  ];
}
