
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeModule } from './GObjectTypeModule';



export type GObjectunload = (module_: GObjectTypeModule) => void;

export async function convertGObjectunloadArgs(data: any): Promise<Parameters<GObjectunload>> {
  return [
    await GObjectTypeModule.create(data.module.ptr, 'none')  ];
}
