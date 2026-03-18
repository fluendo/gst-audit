
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';
import { GstIterator } from './GstIterator';



export type GstIteratorNextFunction = (it: GstIterator, result_: GObjectValue) => void;

export async function convertGstIteratorNextFunctionArgs(data: any): Promise<Parameters<GstIteratorNextFunction>> {
  return [
    await GstIterator.create(data.it.ptr, 'none'),
    await GObjectValue.create(data.result.ptr, 'none')  ];
}
