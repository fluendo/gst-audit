
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstCaps } from '../Gst/GstCaps';



export type GstBaseset_sink_caps = (parse: GstBaseBaseParse, caps: GstCaps) => void;

export async function convertGstBaseset_sink_capsArgs(data: any): Promise<Parameters<GstBaseset_sink_caps>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
