
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstEvent } from '../Gst/GstEvent';



export type GstBaseevent = (sink: GstBaseBaseSink, event: GstEvent) => void;

export async function convertGstBaseeventArgs(data: any): Promise<Parameters<GstBaseevent>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none')  ];
}
