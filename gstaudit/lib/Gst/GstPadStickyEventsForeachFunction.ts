
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstEvent } from './GstEvent';
import { GstPad } from './GstPad';



export type GstPadStickyEventsForeachFunction = (pad: GstPad, event: GstEvent, user_data: Pointer) => void;

export async function convertGstPadStickyEventsForeachFunctionArgs(data: any): Promise<Parameters<GstPadStickyEventsForeachFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none'),
    data.user_data  ];
}
