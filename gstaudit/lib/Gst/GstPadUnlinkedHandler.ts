
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';



export type GstPadUnlinkedHandler = (self: GstPad, peer: GstPad) => void;

export async function convertGstPadUnlinkedHandlerArgs(data: any): Promise<Parameters<GstPadUnlinkedHandler>> {
  return [
    await GstPad.create(data.self.ptr, 'none'),
    await GstPad.create(data.peer.ptr, 'none')  ];
}
