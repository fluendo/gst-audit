
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBus } from './GstBus';
import { GstMessage } from './GstMessage';



export type GstBusFunc = (bus: GstBus, message: GstMessage, user_data: Pointer) => void;

export async function convertGstBusFuncArgs(data: any): Promise<Parameters<GstBusFunc>> {
  return [
    await GstBus.create(data.bus.ptr, 'none'),
    await GstMessage.create(data.message.ptr, 'none'),
    data.user_data  ];
}
