
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstEvent } from '../Gst/GstEvent';



export type GstBasewait_event = (sink: GstBaseBaseSink, event: GstEvent) => void;

export async function convertGstBasewait_eventArgs(data: any): Promise<Parameters<GstBasewait_event>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none')  ];
}
