
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBus } from './GstBus';
import { GstMessage } from './GstMessage';



export type GstBusMessageHandler = (self: GstBus, message: GstMessage) => void;

export async function convertGstBusMessageHandlerArgs(data: any): Promise<Parameters<GstBusMessageHandler>> {
  return [
    await GstBus.create(data.self.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'none')  ];
}
