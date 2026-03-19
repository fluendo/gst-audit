
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoAggregator } from './GstVideoVideoAggregator';
import { GstVideoVideoAggregatorConvertPad } from './GstVideoVideoAggregatorConvertPad';
import { GstVideoVideoInfo } from './GstVideoVideoInfo';



export type GstVideocreate_conversion_info = (pad: GstVideoVideoAggregatorConvertPad, agg: GstVideoVideoAggregator, conversion_info: GstVideoVideoInfo) => void;

export async function convertGstVideocreate_conversion_infoArgs(data: any): Promise<Parameters<GstVideocreate_conversion_info>> {
  return [
    await GstVideoVideoAggregatorConvertPad.create(data.pad.ptr, 'none'),
    await GstVideoVideoAggregator.create(data.agg.ptr, 'none'),
    await GstVideoVideoInfo.create(data.conversion_info.ptr, 'none')  ];
}
