
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';



export type GLibio_read = (channel: GLibIOChannel, buf: string, count: number, bytes_read: number) => void;

export async function convertGLibio_readArgs(data: any): Promise<Parameters<GLibio_read>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none'),
    data.buf,
    data.count,
    data.bytes_read  ];
}
