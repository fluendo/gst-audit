
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibHook } from './GLibHook';
import { GLibHookList } from './GLibHookList';



export type GLibHookFinalizeFunc = (hook_list: GLibHookList, hook: GLibHook) => void;

export async function convertGLibHookFinalizeFuncArgs(data: any): Promise<Parameters<GLibHookFinalizeFunc>> {
  return [
    await GLibHookList.create(data.hook_list.ptr, 'none'),
    await GLibHook.create(data.hook.ptr, 'none')  ];
}
