
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';



export type GLibio_write = (channel: GLibIOChannel, buf: string, count: number, bytes_written: number) => void;

export async function convertGLibio_writeArgs(data: any): Promise<Parameters<GLibio_write>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none'),
    data.buf,
    data.count,
    data.bytes_written  ];
}
