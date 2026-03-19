
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBuffer } from './GstBuffer';
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadChainFunction = (pad: GstPad, parent: GstObject, buffer: GstBuffer) => void;

export async function convertGstPadChainFunctionArgs(data: any): Promise<Parameters<GstPadChainFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    await GstBuffer.create(data.buffer.ptr, 'full')  ];
}
