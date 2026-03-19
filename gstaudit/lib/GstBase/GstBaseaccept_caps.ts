
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstCaps } from '../Gst/GstCaps';
import { GstPadDirection } from '../Gst/GstPadDirection';
import type { GstPadDirectionValue } from '../Gst/GstPadDirection';



export type GstBaseaccept_caps = (trans: GstBaseBaseTransform, direction: GstPadDirectionValue, caps: GstCaps) => void;

export async function convertGstBaseaccept_capsArgs(data: any): Promise<Parameters<GstBaseaccept_caps>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    data.direction,
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
