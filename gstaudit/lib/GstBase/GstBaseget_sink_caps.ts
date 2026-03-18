
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstCaps } from '../Gst/GstCaps';



export type GstBaseget_sink_caps = (parse: GstBaseBaseParse, filter: GstCaps) => void;

export async function convertGstBaseget_sink_capsArgs(data: any): Promise<Parameters<GstBaseget_sink_caps>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    await GstCaps.create(data.filter.ptr, 'none')  ];
}
