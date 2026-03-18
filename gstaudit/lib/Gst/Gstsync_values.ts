
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstControlBinding } from './GstControlBinding';
import { GstObject } from './GstObject';



export type Gstsync_values = (binding: GstControlBinding, object: GstObject, last_sync: number) => void;

export async function convertGstsync_valuesArgs(data: any): Promise<Parameters<Gstsync_values>> {
  return [
    await GstControlBinding.create(data.binding.ptr, 'none'),
    await GstObject.create(data.object.ptr, 'none'),
    data.last_sync  ];
}
