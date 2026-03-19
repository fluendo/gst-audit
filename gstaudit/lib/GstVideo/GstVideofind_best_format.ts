
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from '../Gst/GstCaps';
import { GstVideoVideoAggregator } from './GstVideoVideoAggregator';
import { GstVideoVideoInfo } from './GstVideoVideoInfo';



export type GstVideofind_best_format = (vagg: GstVideoVideoAggregator, downstream_caps: GstCaps, best_info: GstVideoVideoInfo) => void;

export async function convertGstVideofind_best_formatArgs(data: any): Promise<Parameters<GstVideofind_best_format>> {
  return [
    await GstVideoVideoAggregator.create(data.vagg.ptr, 'none'),
    await GstCaps.create(data.downstream_caps.ptr, 'none'),
    await GstVideoVideoInfo.create(data.best_info.ptr, 'none')  ];
}
