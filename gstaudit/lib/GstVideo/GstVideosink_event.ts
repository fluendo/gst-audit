
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstEvent } from '../Gst/GstEvent';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideosink_event = (decoder: GstVideoVideoDecoder, event: GstEvent) => void;

export async function convertGstVideosink_eventArgs(data: any): Promise<Parameters<GstVideosink_event>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none')  ];
}
