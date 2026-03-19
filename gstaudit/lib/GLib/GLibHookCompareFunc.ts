
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibHook } from './GLibHook';



export type GLibHookCompareFunc = (new_hook: GLibHook, sibling: GLibHook) => void;

export async function convertGLibHookCompareFuncArgs(data: any): Promise<Parameters<GLibHookCompareFunc>> {
  return [
    await GLibHook.create(data.new_hook.ptr, 'none'),
    await GLibHook.create(data.sibling.ptr, 'none')  ];
}
