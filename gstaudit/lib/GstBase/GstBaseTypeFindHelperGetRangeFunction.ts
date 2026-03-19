
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from '../Gst/GstObject';



export type GstBaseTypeFindHelperGetRangeFunction = (obj: GstObject, parent: GstObject, offset: number, length: number) => void;

export async function convertGstBaseTypeFindHelperGetRangeFunctionArgs(data: any): Promise<Parameters<GstBaseTypeFindHelperGetRangeFunction>> {
  return [
    await GstObject.create(data.obj.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    data.offset,
    data.length  ];
}
