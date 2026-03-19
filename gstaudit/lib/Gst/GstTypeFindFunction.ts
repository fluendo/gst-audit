
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTypeFind } from './GstTypeFind';



export type GstTypeFindFunction = (find: GstTypeFind, user_data: Pointer) => void;

export async function convertGstTypeFindFunctionArgs(data: any): Promise<Parameters<GstTypeFindFunction>> {
  return [
    await GstTypeFind.create(data.find.ptr, 'none'),
    data.user_data  ];
}
