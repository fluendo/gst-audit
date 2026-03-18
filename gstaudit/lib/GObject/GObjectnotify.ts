
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';
import { GObjectParamSpec } from './GObjectParamSpec';



export type GObjectnotify = (object: GObjectObject, pspec: GObjectParamSpec) => void;

export async function convertGObjectnotifyArgs(data: any): Promise<Parameters<GObjectnotify>> {
  return [
    await GObjectObject.create(data.object.ptr, 'none'),
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
