
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectSignalGroup } from './GObjectSignalGroup';



export type GObjectSignalGroupUnbindHandler = (self: GObjectSignalGroup) => void;

export async function convertGObjectSignalGroupUnbindHandlerArgs(data: any): Promise<Parameters<GObjectSignalGroupUnbindHandler>> {
  return [
    await GObjectSignalGroup.create(data.self.ptr, 'none')  ];
}
