
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseSink } from './GstBaseBaseSink';
import { GstBufferList } from '../Gst/GstBufferList';



export type GstBaserender_list = (sink: GstBaseBaseSink, buffer_list: GstBufferList) => void;

export async function convertGstBaserender_listArgs(data: any): Promise<Parameters<GstBaserender_list>> {
  return [
    await GstBaseBaseSink.create(data.sink.ptr, 'none'),
    await GstBufferList.create(data.buffer_list.ptr, 'none')  ];
}
