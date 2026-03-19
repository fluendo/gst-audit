
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPluginFeature } from './GstPluginFeature';
import { GstRegistry } from './GstRegistry';



export type GstRegistryFeatureAddedHandler = (self: GstRegistry, feature: GstPluginFeature) => void;

export async function convertGstRegistryFeatureAddedHandlerArgs(data: any): Promise<Parameters<GstRegistryFeatureAddedHandler>> {
  return [
    await GstRegistry.create(data.self.ptr, 'none'),
    await GstPluginFeature.create(data.feature.ptr, 'none')  ];
}
