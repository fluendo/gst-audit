
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBus } from './GstBus';
import { GstMessage } from './GstMessage';



export type GstBusSyncMessageHandler = (self: GstBus, message: GstMessage) => void;

export async function convertGstBusSyncMessageHandlerArgs(data: any): Promise<Parameters<GstBusSyncMessageHandler>> {
  return [
    await GstBus.create(data.self.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'none')  ];
}
