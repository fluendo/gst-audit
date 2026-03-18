
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBus } from './GstBus';
import { GstMessage } from './GstMessage';



export type Gstmessage = (bus: GstBus, message: GstMessage) => void;

export async function convertGstmessageArgs(data: any): Promise<Parameters<Gstmessage>> {
  return [
    await GstBus.create(data.bus.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'none')  ];
}
