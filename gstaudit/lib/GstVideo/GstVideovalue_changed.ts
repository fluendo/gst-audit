
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoColorBalanceChannel } from './GstVideoColorBalanceChannel';



export type GstVideovalue_changed = (channel: GstVideoColorBalanceChannel, value_: number) => void;

export async function convertGstVideovalue_changedArgs(data: any): Promise<Parameters<GstVideovalue_changed>> {
  return [
    await GstVideoColorBalanceChannel.create(data.channel.ptr, 'none'),
    data.value  ];
}
