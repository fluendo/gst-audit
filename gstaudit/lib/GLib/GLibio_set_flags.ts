
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';
import type { GLibIOFlags } from './GLibIOFlags';



export type GLibio_set_flags = (channel: GLibIOChannel, flags: GLibIOFlags) => void;

export async function convertGLibio_set_flagsArgs(data: any): Promise<Parameters<GLibio_set_flags>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none'),
    data.flags  ];
}
