
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstContext } from './GstContext';
import { GstElement } from './GstElement';



export type Gstset_context = (element: GstElement, context: GstContext) => void;

export async function convertGstset_contextArgs(data: any): Promise<Parameters<Gstset_context>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstContext.create(data.context.ptr, 'none')  ];
}
