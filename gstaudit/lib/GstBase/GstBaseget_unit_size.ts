
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstCaps } from '../Gst/GstCaps';



export type GstBaseget_unit_size = (trans: GstBaseBaseTransform, caps: GstCaps) => void;

export async function convertGstBaseget_unit_sizeArgs(data: any): Promise<Parameters<GstBaseget_unit_size>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
