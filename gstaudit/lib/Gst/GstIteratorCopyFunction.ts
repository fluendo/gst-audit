
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstIterator } from './GstIterator';



export type GstIteratorCopyFunction = (it: GstIterator, copy: GstIterator) => void;

export async function convertGstIteratorCopyFunctionArgs(data: any): Promise<Parameters<GstIteratorCopyFunction>> {
  return [
    await GstIterator.create(data.it.ptr, 'none'),
    await GstIterator.create(data.copy.ptr, 'none')  ];
}
