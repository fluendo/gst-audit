
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstStructureFilterMapFunc = (field_id: number, value_: GObjectValue, user_data: Pointer) => void;

export async function convertGstStructureFilterMapFuncArgs(data: any): Promise<Parameters<GstStructureFilterMapFunc>> {
  return [
    data.field_id,
    await GObjectValue.create(data.value.ptr, 'none'),
    data.user_data  ];
}
