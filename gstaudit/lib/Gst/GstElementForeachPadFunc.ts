
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstPad } from './GstPad';



export type GstElementForeachPadFunc = (element: GstElement, pad: GstPad, user_data: Pointer) => void;

export async function convertGstElementForeachPadFuncArgs(data: any): Promise<Parameters<GstElementForeachPadFunc>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none'),
    data.user_data  ];
}
