
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBin } from './GstBin';
import { GstMessage } from './GstMessage';



export type Gsthandle_message = (bin: GstBin, message: GstMessage) => void;

export async function convertGsthandle_messageArgs(data: any): Promise<Parameters<Gsthandle_message>> {
  return [
    await GstBin.create(data.bin.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'full')  ];
}
