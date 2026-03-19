
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPlugin } from './GstPlugin';
import { GstRegistry } from './GstRegistry';



export type GstRegistryPluginAddedHandler = (self: GstRegistry, plugin: GstPlugin) => void;

export async function convertGstRegistryPluginAddedHandlerArgs(data: any): Promise<Parameters<GstRegistryPluginAddedHandler>> {
  return [
    await GstRegistry.create(data.self.ptr, 'none'),
    await GstPlugin.create(data.plugin.ptr, 'none')  ];
}
