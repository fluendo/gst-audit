
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibIOChannel } from './GLibIOChannel';
import { GLibIOCondition } from './GLibIOCondition';
import type { GLibIOConditionValue } from './GLibIOCondition';



export type GLibio_create_watch = (channel: GLibIOChannel, condition: GLibIOConditionValue) => void;

export async function convertGLibio_create_watchArgs(data: any): Promise<Parameters<GLibio_create_watch>> {
  return [
    await GLibIOChannel.create(data.channel.ptr, 'none'),
    data.condition  ];
}
