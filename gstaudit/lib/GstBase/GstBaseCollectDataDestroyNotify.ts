
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectData } from './GstBaseCollectData';



export type GstBaseCollectDataDestroyNotify = (data_: GstBaseCollectData) => void;

export async function convertGstBaseCollectDataDestroyNotifyArgs(data: any): Promise<Parameters<GstBaseCollectDataDestroyNotify>> {
  return [
    await GstBaseCollectData.create(data.data.ptr, 'none')  ];
}
