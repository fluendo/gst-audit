
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from './GObjectParamSpec';



export type GObjectfinalize = (pspec: GObjectParamSpec) => void;

export async function convertGObjectfinalizeArgs(data: any): Promise<Parameters<GObjectfinalize>> {
  return [
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
