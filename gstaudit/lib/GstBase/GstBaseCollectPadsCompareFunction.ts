
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectData } from './GstBaseCollectData';
import { GstBaseCollectPads } from './GstBaseCollectPads';



export type GstBaseCollectPadsCompareFunction = (pads: GstBaseCollectPads, data1: GstBaseCollectData, timestamp1: number, data2: GstBaseCollectData, timestamp2: number, user_data: Pointer) => void;

export async function convertGstBaseCollectPadsCompareFunctionArgs(data: any): Promise<Parameters<GstBaseCollectPadsCompareFunction>> {
  return [
    await GstBaseCollectPads.create(data.pads.ptr, 'none'),
    await GstBaseCollectData.create(data.data1.ptr, 'none'),
    data.timestamp1,
    await GstBaseCollectData.create(data.data2.ptr, 'none'),
    data.timestamp2,
    data.user_data  ];
}
