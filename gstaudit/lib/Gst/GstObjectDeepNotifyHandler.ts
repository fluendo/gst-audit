
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GstObject } from './GstObject';



export type GstObjectDeepNotifyHandler = (self: GstObject, prop_object: GstObject, prop: GObjectParamSpec) => void;

export async function convertGstObjectDeepNotifyHandlerArgs(data: any): Promise<Parameters<GstObjectDeepNotifyHandler>> {
  return [
    await GstObject.create(data.self.ptr, 'none'),
    await GstObject.create(data.prop_object.ptr, 'none'),
    await GObjectParamSpec.create(data.prop.ptr, 'none')  ];
}
