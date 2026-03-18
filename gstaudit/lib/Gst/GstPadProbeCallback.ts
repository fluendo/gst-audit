
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';
import { GstPadProbeInfo } from './GstPadProbeInfo';



export type GstPadProbeCallback = (pad: GstPad, info: GstPadProbeInfo, user_data: Pointer) => void;

export async function convertGstPadProbeCallbackArgs(data: any): Promise<Parameters<GstPadProbeCallback>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstPadProbeInfo.create(data.info.ptr, 'none'),
    data.user_data  ];
}
