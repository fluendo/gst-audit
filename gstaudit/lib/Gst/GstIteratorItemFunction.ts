
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectValue } from '../GObject/GObjectValue';
import { GstIterator } from './GstIterator';



export type GstIteratorItemFunction = (it: GstIterator, item: GObjectValue) => void;

export async function convertGstIteratorItemFunctionArgs(data: any): Promise<Parameters<GstIteratorItemFunction>> {
  return [
    await GstIterator.create(data.it.ptr, 'none'),
    await GObjectValue.create(data.item.ptr, 'none')  ];
}
