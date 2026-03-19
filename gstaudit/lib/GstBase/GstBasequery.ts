
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstQuery } from '../Gst/GstQuery';



export type GstBasequery = (sink: GstBaseBaseSink, query: GstQuery) => void;

export async function convertGstBasequeryArgs(data: any): Promise<Parameters<GstBasequery>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
