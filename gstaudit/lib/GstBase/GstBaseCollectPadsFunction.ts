
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectPads } from './GstBaseCollectPads';



export type GstBaseCollectPadsFunction = (pads: GstBaseCollectPads, user_data: Pointer) => void;

export async function convertGstBaseCollectPadsFunctionArgs(data: any): Promise<Parameters<GstBaseCollectPadsFunction>> {
  return [
    await GstBaseCollectPads.create(data.pads.ptr, 'none'),
    data.user_data  ];
}
