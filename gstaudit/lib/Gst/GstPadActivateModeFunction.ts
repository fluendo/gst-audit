
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';
import { GstPadMode } from './GstPadMode';
import type { GstPadModeValue } from './GstPadMode';



export type GstPadActivateModeFunction = (pad: GstPad, parent: GstObject, mode: GstPadModeValue, active: boolean) => void;

export async function convertGstPadActivateModeFunctionArgs(data: any): Promise<Parameters<GstPadActivateModeFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    data.mode,
    data.active  ];
}
