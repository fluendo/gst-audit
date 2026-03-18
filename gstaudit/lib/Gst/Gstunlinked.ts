
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';



export type Gstunlinked = (pad: GstPad, peer: GstPad) => void;

export async function convertGstunlinkedArgs(data: any): Promise<Parameters<Gstunlinked>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstPad.create(data.peer.ptr, 'none')  ];
}
