
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectData } from './GstBaseCollectData';
import { GstBaseCollectPads } from './GstBaseCollectPads';
import { GstQuery } from '../Gst/GstQuery';



export type GstBaseCollectPadsQueryFunction = (pads: GstBaseCollectPads, pad: GstBaseCollectData, query: GstQuery, user_data: Pointer) => void;

export async function convertGstBaseCollectPadsQueryFunctionArgs(data: any): Promise<Parameters<GstBaseCollectPadsQueryFunction>> {
  return [
    await GstBaseCollectPads.create(data.pads.ptr, 'none'),
    await GstBaseCollectData.create(data.pad.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none'),
    data.user_data  ];
}
