
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMiniObject } from './GstMiniObject';



export type GstMiniObjectDisposeFunction = (obj: GstMiniObject) => void;

export async function convertGstMiniObjectDisposeFunctionArgs(data: any): Promise<Parameters<GstMiniObjectDisposeFunction>> {
  return [
    await GstMiniObject.create(data.obj.ptr, 'none')  ];
}
