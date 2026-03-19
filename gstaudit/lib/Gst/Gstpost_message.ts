
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstMessage } from './GstMessage';



export type Gstpost_message = (element: GstElement, message: GstMessage) => void;

export async function convertGstpost_messageArgs(data: any): Promise<Parameters<Gstpost_message>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'full')  ];
}
