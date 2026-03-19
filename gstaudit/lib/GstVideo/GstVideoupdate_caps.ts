
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from '../Gst/GstCaps';
import { GstVideoVideoAggregator } from './GstVideoVideoAggregator';



export type GstVideoupdate_caps = (videoaggregator: GstVideoVideoAggregator, caps: GstCaps) => void;

export async function convertGstVideoupdate_capsArgs(data: any): Promise<Parameters<GstVideoupdate_caps>> {
  return [
    await GstVideoVideoAggregator.create(data.videoaggregator.ptr, 'none'),
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
