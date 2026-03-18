
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GstObject } from './GstObject';



export type Gstdeep_notify = (object: GstObject, orig: GstObject, pspec: GObjectParamSpec) => void;

export async function convertGstdeep_notifyArgs(data: any): Promise<Parameters<Gstdeep_notify>> {
  return [
    await GstObject.create(data.object.ptr, 'none'),
    await GstObject.create(data.orig.ptr, 'none'),
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
