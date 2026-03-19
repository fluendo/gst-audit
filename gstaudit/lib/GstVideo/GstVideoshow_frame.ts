
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from '../Gst/GstBuffer';
import { GstVideoVideoSink } from './GstVideoVideoSink';



export type GstVideoshow_frame = (video_sink: GstVideoVideoSink, buf: GstBuffer) => void;

export async function convertGstVideoshow_frameArgs(data: any): Promise<Parameters<GstVideoshow_frame>> {
  return [
    await GstVideoVideoSink.create(data.video_sink.ptr, 'none'),
    await GstBuffer.create(data.buf.ptr, 'none')  ];
}
