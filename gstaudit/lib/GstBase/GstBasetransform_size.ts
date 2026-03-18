
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstCaps } from '../Gst/GstCaps';
import { GstPadDirection } from '../Gst/GstPadDirection';
import type { GstPadDirectionValue } from '../Gst/GstPadDirection';



export type GstBasetransform_size = (trans: GstBaseBaseTransform, direction: GstPadDirectionValue, caps: GstCaps, size: number, othercaps: GstCaps) => void;

export async function convertGstBasetransform_sizeArgs(data: any): Promise<Parameters<GstBasetransform_size>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    data.direction,
    await GstCaps.create(data.caps.ptr, 'none'),
    data.size,
    await GstCaps.create(data.othercaps.ptr, 'none')  ];
}
