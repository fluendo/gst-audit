
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectInterfaceInfo } from './GObjectInterfaceInfo';



export type GObjectTypePluginCompleteInterfaceInfo = (plugin: Pointer, instance_type: string, interface_type: string, info: GObjectInterfaceInfo) => void;

export async function convertGObjectTypePluginCompleteInterfaceInfoArgs(data: any): Promise<Parameters<GObjectTypePluginCompleteInterfaceInfo>> {
  return [
    data.plugin,
    data.instance_type,
    data.interface_type,
    await GObjectInterfaceInfo.create(data.info.ptr, 'none')  ];
}
