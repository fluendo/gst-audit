
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';
import { GObjectParamSpec } from './GObjectParamSpec';



export type GObjectdispatch_properties_changed = (object: GObjectObject, n_pspecs: number, pspecs: GObjectParamSpec) => void;

export async function convertGObjectdispatch_properties_changedArgs(data: any): Promise<Parameters<GObjectdispatch_properties_changed>> {
  return [
    await GObjectObject.create(data.object.ptr, 'none'),
    data.n_pspecs,
    await GObjectParamSpec.create(data.pspecs.ptr, 'none')  ];
}
