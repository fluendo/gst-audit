
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';



export type GLibio_free = (channel: GLibIOChannel) => void;

export async function convertGLibio_freeArgs(data: any): Promise<Parameters<GLibio_free>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none')  ];
}
