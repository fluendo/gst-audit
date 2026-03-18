
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeClass } from './GObjectTypeClass';



export type GObjectClassInitFunc = (g_class: GObjectTypeClass, class_data: Pointer) => void;

export async function convertGObjectClassInitFuncArgs(data: any): Promise<Parameters<GObjectClassInitFunc>> {
  return [
    await GObjectTypeClass.create(data.g_class.ptr, 'none'),
    data.class_data  ];
}
