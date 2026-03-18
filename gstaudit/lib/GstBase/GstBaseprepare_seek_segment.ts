
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSrc } from './GstBaseBaseSrc';
import { GstEvent } from '../Gst/GstEvent';
import { GstSegment } from '../Gst/GstSegment';



export type GstBaseprepare_seek_segment = (src: GstBaseBaseSrc, seek: GstEvent, segment: GstSegment) => void;

export async function convertGstBaseprepare_seek_segmentArgs(data: any): Promise<Parameters<GstBaseprepare_seek_segment>> {
  return [
    await GstBaseBaseSrc.create(data.src.ptr, 'none'),
    await GstEvent.create(data.seek.ptr, 'none'),
    await GstSegment.create(data.segment.ptr, 'none')  ];
}
