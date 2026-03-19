
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeClass } from './GObjectTypeClass';



export type GObjectBaseInitFunc = (g_class: GObjectTypeClass) => void;

export async function convertGObjectBaseInitFuncArgs(data: any): Promise<Parameters<GObjectBaseInitFunc>> {
  return [
    await GObjectTypeClass.create(data.g_class.ptr, 'none')  ];
}
