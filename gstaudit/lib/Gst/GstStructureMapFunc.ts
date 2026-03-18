
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstStructureMapFunc = (field_id: number, value_: GObjectValue, user_data: Pointer) => void;

export async function convertGstStructureMapFuncArgs(data: any): Promise<Parameters<GstStructureMapFunc>> {
  return [
    data.field_id,
    await GObjectValue.create(data.value.ptr, 'none'),
    data.user_data  ];
}
