
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBufferList } from './GstBufferList';
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadChainListFunction = (pad: GstPad, parent: GstObject, list: GstBufferList) => void;

export async function convertGstPadChainListFunctionArgs(data: any): Promise<Parameters<GstPadChainListFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    await GstBufferList.create(data.list.ptr, 'full')  ];
}
