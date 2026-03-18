
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';



export type GObjectdispose = (object: GObjectObject) => void;

export async function convertGObjectdisposeArgs(data: any): Promise<Parameters<GObjectdispose>> {
  return [
    await GObjectObject.create(data.object.ptr, 'none')  ];
}
