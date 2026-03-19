
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';
import { GObjectSignalGroup } from './GObjectSignalGroup';



export type GObjectSignalGroupBindHandler = (self: GObjectSignalGroup, instance: GObjectObject) => void;

export async function convertGObjectSignalGroupBindHandlerArgs(data: any): Promise<Parameters<GObjectSignalGroupBindHandler>> {
  return [
    await GObjectSignalGroup.create(data.self.ptr, 'none'),
    await GObjectObject.create(data.instance.ptr, 'none')  ];
}
