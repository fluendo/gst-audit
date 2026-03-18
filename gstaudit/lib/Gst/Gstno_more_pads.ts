
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';



export type Gstno_more_pads = (element: GstElement) => void;

export async function convertGstno_more_padsArgs(data: any): Promise<Parameters<Gstno_more_pads>> {
  return [
    await GstElement.create(data.element.ptr, 'none')  ];
}
