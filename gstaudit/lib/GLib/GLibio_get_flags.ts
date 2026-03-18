
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';



export type GLibio_get_flags = (channel: GLibIOChannel) => void;

export async function convertGLibio_get_flagsArgs(data: any): Promise<Parameters<GLibio_get_flags>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none')  ];
}
