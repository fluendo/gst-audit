
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeInfo } from './GObjectTypeInfo';
import { GObjectTypeValueTable } from './GObjectTypeValueTable';



export type GObjectTypePluginCompleteTypeInfo = (plugin: Pointer, g_type: string, info: GObjectTypeInfo, value_table: GObjectTypeValueTable) => void;

export async function convertGObjectTypePluginCompleteTypeInfoArgs(data: any): Promise<Parameters<GObjectTypePluginCompleteTypeInfo>> {
  return [
    data.plugin,
    data.g_type,
    await GObjectTypeInfo.create(data.info.ptr, 'none'),
    await GObjectTypeValueTable.create(data.value_table.ptr, 'none')  ];
}
