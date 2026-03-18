
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibHook } from './GLibHook';



export type GLibHookMarshaller = (hook: GLibHook, marshal_data: Pointer) => void;

export async function convertGLibHookMarshallerArgs(data: any): Promise<Parameters<GLibHookMarshaller>> {
  return [
    await GLibHook.create(data.hook.ptr, 'none'),
    data.marshal_data  ];
}
