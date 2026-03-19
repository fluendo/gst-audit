
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoAggregator } from './GstVideoVideoAggregator';
import { GstVideoVideoAggregatorPad } from './GstVideoVideoAggregatorPad';
import { GstVideoVideoFrame } from './GstVideoVideoFrame';



export type GstVideoprepare_frame_finish = (pad: GstVideoVideoAggregatorPad, videoaggregator: GstVideoVideoAggregator, prepared_frame: GstVideoVideoFrame) => void;

export async function convertGstVideoprepare_frame_finishArgs(data: any): Promise<Parameters<GstVideoprepare_frame_finish>> {
  return [
    await GstVideoVideoAggregatorPad.create(data.pad.ptr, 'none'),
    await GstVideoVideoAggregator.create(data.videoaggregator.ptr, 'none'),
    await GstVideoVideoFrame.create(data.prepared_frame.ptr, 'none')  ];
}
