
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';



export type GstBasegenerate_output = (trans: GstBaseBaseTransform) => void;

export async function convertGstBasegenerate_outputArgs(data: any): Promise<Parameters<GstBasegenerate_output>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none')  ];
}
