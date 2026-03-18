
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoAggregatorPad } from './GstVideoVideoAggregatorPad';



export type GstVideoupdate_conversion_info = (pad: GstVideoVideoAggregatorPad) => void;

export async function convertGstVideoupdate_conversion_infoArgs(data: any): Promise<Parameters<GstVideoupdate_conversion_info>> {
  return [
    await GstVideoVideoAggregatorPad.create(data.pad.ptr, 'none')  ];
}
