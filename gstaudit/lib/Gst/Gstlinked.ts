
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';



export type Gstlinked = (pad: GstPad, peer: GstPad) => void;

export async function convertGstlinkedArgs(data: any): Promise<Parameters<Gstlinked>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstPad.create(data.peer.ptr, 'none')  ];
}
