
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadGetRangeFunction = (pad: GstPad, parent: GstObject, offset: number, length: number, buffer: GstBuffer) => void;

export async function convertGstPadGetRangeFunctionArgs(data: any): Promise<Parameters<GstPadGetRangeFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    data.offset,
    data.length,
    await GstBuffer.create(data.buffer.ptr, 'none')  ];
}
