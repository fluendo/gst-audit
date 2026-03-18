
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstMetaInfo } from './GstMetaInfo';



export type GstMetaDeserializeFunction = (info: GstMetaInfo, buffer: GstBuffer, data_: number, size: number, version: number) => void;

export async function convertGstMetaDeserializeFunctionArgs(data: any): Promise<Parameters<GstMetaDeserializeFunction>> {
  return [
    await GstMetaInfo.create(data.info.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none'),
    data.data,
    data.size,
    data.version  ];
}
