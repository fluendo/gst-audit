
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from '../Gst/GstBuffer';
import { GstVideoVideoAggregator } from './GstVideoVideoAggregator';



export type GstVideoaggregate_frames = (videoaggregator: GstVideoVideoAggregator, outbuffer: GstBuffer) => void;

export async function convertGstVideoaggregate_framesArgs(data: any): Promise<Parameters<GstVideoaggregate_frames>> {
  return [
    await GstVideoVideoAggregator.create(data.videoaggregator.ptr, 'none'),
    await GstBuffer.create(data.outbuffer.ptr, 'none')  ];
}
