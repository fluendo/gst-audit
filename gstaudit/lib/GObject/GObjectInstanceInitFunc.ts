
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeClass } from './GObjectTypeClass';
import { GObjectTypeInstance } from './GObjectTypeInstance';



export type GObjectInstanceInitFunc = (instance: GObjectTypeInstance, g_class: GObjectTypeClass) => void;

export async function convertGObjectInstanceInitFuncArgs(data: any): Promise<Parameters<GObjectInstanceInitFunc>> {
  return [
    await GObjectTypeInstance.create(data.instance.ptr, 'none'),
    await GObjectTypeClass.create(data.g_class.ptr, 'none')  ];
}
