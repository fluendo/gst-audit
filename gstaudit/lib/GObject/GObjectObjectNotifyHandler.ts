
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';
import { GObjectParamSpec } from './GObjectParamSpec';



export type GObjectObjectNotifyHandler = (self: GObjectObject, pspec: GObjectParamSpec) => void;

export async function convertGObjectObjectNotifyHandlerArgs(data: any): Promise<Parameters<GObjectObjectNotifyHandler>> {
  return [
    await GObjectObject.create(data.self.ptr, 'none'),
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
