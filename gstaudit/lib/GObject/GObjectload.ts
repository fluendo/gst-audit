
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeModule } from './GObjectTypeModule';



export type GObjectload = (module_: GObjectTypeModule) => void;

export async function convertGObjectloadArgs(data: any): Promise<Parameters<GObjectload>> {
  return [
    await GObjectTypeModule.create(data.module.ptr, 'none')  ];
}
