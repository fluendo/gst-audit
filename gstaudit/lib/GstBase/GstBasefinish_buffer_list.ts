
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstBufferList } from '../Gst/GstBufferList';



export type GstBasefinish_buffer_list = (aggregator: GstBaseAggregator, bufferlist: GstBufferList) => void;

export async function convertGstBasefinish_buffer_listArgs(data: any): Promise<Parameters<GstBasefinish_buffer_list>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    await GstBufferList.create(data.bufferlist.ptr, 'full')  ];
}
