
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeInterface } from './GObjectTypeInterface';



export type GObjectInterfaceFinalizeFunc = (g_iface: GObjectTypeInterface, iface_data: Pointer) => void;

export async function convertGObjectInterfaceFinalizeFuncArgs(data: any): Promise<Parameters<GObjectInterfaceFinalizeFunc>> {
  return [
    await GObjectTypeInterface.create(data.g_iface.ptr, 'none'),
    data.iface_data  ];
}
