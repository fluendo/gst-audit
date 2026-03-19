
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';



export type GObjectconstructed = (object: GObjectObject) => void;

export async function convertGObjectconstructedArgs(data: any): Promise<Parameters<GObjectconstructed>> {
  return [
    await GObjectObject.create(data.object.ptr, 'none')  ];
}
