
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoColorBalanceChannel } from './GstVideoColorBalanceChannel';



export type GstVideoColorBalanceChannelValueChangedHandler = (self: GstVideoColorBalanceChannel, value_: number) => void;

export async function convertGstVideoColorBalanceChannelValueChangedHandlerArgs(data: any): Promise<Parameters<GstVideoColorBalanceChannelValueChangedHandler>> {
  return [
    await GstVideoColorBalanceChannel.create(data.self.ptr, 'none'),
    data.value  ];
}
