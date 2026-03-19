
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';



export type GstPadForwardFunction = (pad: GstPad, user_data: Pointer) => void;

export async function convertGstPadForwardFunctionArgs(data: any): Promise<Parameters<GstPadForwardFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    data.user_data  ];
}
