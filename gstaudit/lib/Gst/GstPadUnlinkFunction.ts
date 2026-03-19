
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadUnlinkFunction = (pad: GstPad, parent: GstObject) => void;

export async function convertGstPadUnlinkFunctionArgs(data: any): Promise<Parameters<GstPadUnlinkFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none')  ];
}
