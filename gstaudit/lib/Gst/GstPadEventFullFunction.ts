
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstEvent } from './GstEvent';
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';



export type GstPadEventFullFunction = (pad: GstPad, parent: GstObject, event: GstEvent) => void;

export async function convertGstPadEventFullFunctionArgs(data: any): Promise<Parameters<GstPadEventFullFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'full')  ];
}
