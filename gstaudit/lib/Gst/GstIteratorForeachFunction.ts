
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstIteratorForeachFunction = (item: GObjectValue, user_data: Pointer) => void;

export async function convertGstIteratorForeachFunctionArgs(data: any): Promise<Parameters<GstIteratorForeachFunction>> {
  return [
    await GObjectValue.create(data.item.ptr, 'none'),
    data.user_data  ];
}
