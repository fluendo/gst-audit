
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstBuffer } from '../Gst/GstBuffer';



export type GstBasedetect = (parse: GstBaseBaseParse, buffer: GstBuffer) => void;

export async function convertGstBasedetectArgs(data: any): Promise<Parameters<GstBasedetect>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
