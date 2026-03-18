
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPlugin } from './GstPlugin';



export type GstPluginFilter = (plugin: GstPlugin, user_data: Pointer) => void;

export async function convertGstPluginFilterArgs(data: any): Promise<Parameters<GstPluginFilter>> {
  return [
    await GstPlugin.create(data.plugin.ptr, 'none'),
    data.user_data  ];
}
