
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPluginFeature } from './GstPluginFeature';



export type GstPluginFeatureFilter = (feature: GstPluginFeature, user_data: Pointer) => void;

export async function convertGstPluginFeatureFilterArgs(data: any): Promise<Parameters<GstPluginFeatureFilter>> {
  return [
    await GstPluginFeature.create(data.feature.ptr, 'none'),
    data.user_data  ];
}
