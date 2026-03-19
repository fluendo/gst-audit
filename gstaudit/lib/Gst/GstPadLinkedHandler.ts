
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';



export type GstPadLinkedHandler = (self: GstPad, peer: GstPad) => void;

export async function convertGstPadLinkedHandlerArgs(data: any): Promise<Parameters<GstPadLinkedHandler>> {
  return [
    await GstPad.create(data.self.ptr, 'none'),
    await GstPad.create(data.peer.ptr, 'none')  ];
}
