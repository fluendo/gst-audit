
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';
import type { GLibSeekType } from './GLibSeekType';



export type GLibio_seek = (channel: GLibIOChannel, offset: number, type_: GLibSeekType) => void;

export async function convertGLibio_seekArgs(data: any): Promise<Parameters<GLibio_seek>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none'),
    data.offset,
    data.type  ];
}
