
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GObjectTypePluginUnuse = (plugin: Pointer) => void;

export async function convertGObjectTypePluginUnuseArgs(data: any): Promise<Parameters<GObjectTypePluginUnuse>> {
  return [
    data.plugin  ];
}
