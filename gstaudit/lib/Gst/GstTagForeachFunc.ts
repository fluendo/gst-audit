
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstTagList } from './GstTagList';



export type GstTagForeachFunc = (list: GstTagList, tag: string, user_data: Pointer) => void;

export async function convertGstTagForeachFuncArgs(data: any): Promise<Parameters<GstTagForeachFunc>> {
  return [
    await GstTagList.create(data.list.ptr, 'none'),
    data.tag,
    data.user_data  ];
}
