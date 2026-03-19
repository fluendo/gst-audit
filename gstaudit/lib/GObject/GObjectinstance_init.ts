
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from './GObjectParamSpec';



export type GObjectinstance_init = (pspec: GObjectParamSpec) => void;

export async function convertGObjectinstance_initArgs(data: any): Promise<Parameters<GObjectinstance_init>> {
  return [
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
