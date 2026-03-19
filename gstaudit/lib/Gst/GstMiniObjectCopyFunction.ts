
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMiniObject } from './GstMiniObject';



export type GstMiniObjectCopyFunction = (obj: GstMiniObject) => void;

export async function convertGstMiniObjectCopyFunctionArgs(data: any): Promise<Parameters<GstMiniObjectCopyFunction>> {
  return [
    await GstMiniObject.create(data.obj.ptr, 'none')  ];
}
