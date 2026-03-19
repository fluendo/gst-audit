
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadLinkFunction = (pad: GstPad, parent: GstObject, peer: GstPad) => void;

export async function convertGstPadLinkFunctionArgs(data: any): Promise<Parameters<GstPadLinkFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    await GstPad.create(data.peer.ptr, 'none')  ];
}
