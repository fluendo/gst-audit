
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';
import { GstSegment } from '../Gst/GstSegment';



export type GstBasedo_seek = (src: GstBaseBaseSrc, segment: GstSegment) => void;

export async function convertGstBasedo_seekArgs(data: any): Promise<Parameters<GstBasedo_seek>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none'),
    await GstSegment.create(data.segment.ptr, 'none')  ];
}
