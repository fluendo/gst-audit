
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';
import { GstPadTemplate } from './GstPadTemplate';



export type GstPadTemplatePadCreatedHandler = (self: GstPadTemplate, pad: GstPad) => void;

export async function convertGstPadTemplatePadCreatedHandlerArgs(data: any): Promise<Parameters<GstPadTemplatePadCreatedHandler>> {
  return [
    await GstPadTemplate.create(data.self.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none')  ];
}
