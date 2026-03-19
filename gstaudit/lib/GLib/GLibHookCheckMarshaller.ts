
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibHook } from './GLibHook';



export type GLibHookCheckMarshaller = (hook: GLibHook, marshal_data: Pointer) => void;

export async function convertGLibHookCheckMarshallerArgs(data: any): Promise<Parameters<GLibHookCheckMarshaller>> {
  return [
    await GLibHook.create(data.hook.ptr, 'none'),
    data.marshal_data  ];
}
