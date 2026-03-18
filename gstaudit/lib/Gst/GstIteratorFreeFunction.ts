
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstIterator } from './GstIterator';



export type GstIteratorFreeFunction = (it: GstIterator) => void;

export async function convertGstIteratorFreeFunctionArgs(data: any): Promise<Parameters<GstIteratorFreeFunction>> {
  return [
    await GstIterator.create(data.it.ptr, 'none')  ];
}
