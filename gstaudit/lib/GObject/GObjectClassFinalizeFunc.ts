
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeClass } from './GObjectTypeClass';



export type GObjectClassFinalizeFunc = (g_class: GObjectTypeClass, class_data: Pointer) => void;

export async function convertGObjectClassFinalizeFuncArgs(data: any): Promise<Parameters<GObjectClassFinalizeFunc>> {
  return [
    await GObjectTypeClass.create(data.g_class.ptr, 'none'),
    data.class_data  ];
}
