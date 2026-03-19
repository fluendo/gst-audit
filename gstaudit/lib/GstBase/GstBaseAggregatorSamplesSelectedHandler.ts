
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstSegment } from '../Gst/GstSegment';
import { GstStructure } from '../Gst/GstStructure';



export type GstBaseAggregatorSamplesSelectedHandler = (self: GstBaseAggregator, segment: GstSegment, pts: number, dts: number, duration: number, info: GstStructure) => void;

export async function convertGstBaseAggregatorSamplesSelectedHandlerArgs(data: any): Promise<Parameters<GstBaseAggregatorSamplesSelectedHandler>> {
  return [
    await GstBaseAggregator.create(data.self.ptr, 'none'),
    await GstSegment.create(data.segment.ptr, 'none'),
    data.pts,
    data.dts,
    data.duration,
    await GstStructure.create(data.info.ptr, 'none')  ];
}
