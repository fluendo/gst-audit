
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';



export type GstIteratorFoldFunction = (item: GObjectValue, ret: GObjectValue, user_data: Pointer) => void;

export async function convertGstIteratorFoldFunctionArgs(data: any): Promise<Parameters<GstIteratorFoldFunction>> {
  return [
    await GObjectValue.create(data.item.ptr, 'none'),
    await GObjectValue.create(data.ret.ptr, 'none'),
    data.user_data  ];
}
