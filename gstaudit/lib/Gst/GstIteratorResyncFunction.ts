
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstIterator } from './GstIterator';



export type GstIteratorResyncFunction = (it: GstIterator) => void;

export async function convertGstIteratorResyncFunctionArgs(data: any): Promise<Parameters<GstIteratorResyncFunction>> {
  return [
    await GstIterator.create(data.it.ptr, 'none')  ];
}
