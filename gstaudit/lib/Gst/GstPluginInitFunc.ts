
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPlugin } from './GstPlugin';



export type GstPluginInitFunc = (plugin: GstPlugin) => void;

export async function convertGstPluginInitFuncArgs(data: any): Promise<Parameters<GstPluginInitFunc>> {
  return [
    await GstPlugin.create(data.plugin.ptr, 'none')  ];
}
