
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectData } from './GstBaseCollectData';
import { GstBaseCollectPads } from './GstBaseCollectPads';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBaseCollectPadsBufferFunction = (pads: GstBaseCollectPads, data_: GstBaseCollectData, buffer: GstBuffer, user_data: Pointer) => void;

export async function convertGstBaseCollectPadsBufferFunctionArgs(data: any): Promise<Parameters<GstBaseCollectPadsBufferFunction>> {
  return [
    await GstBaseCollectPads.create(data.pads.ptr, 'none'),
    await GstBaseCollectData.create(data.data.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'full'),
    data.user_data  ];
}
