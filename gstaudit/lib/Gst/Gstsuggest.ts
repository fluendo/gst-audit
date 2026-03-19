
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from './GstCaps';



export type Gstsuggest = (data_: Pointer, probability: number, caps: GstCaps) => void;

export async function convertGstsuggestArgs(data: any): Promise<Parameters<Gstsuggest>> {
  return [
    data.data,
    data.probability,
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
