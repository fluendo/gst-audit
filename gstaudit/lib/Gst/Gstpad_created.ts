
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstPad } from './GstPad';
import { GstPadTemplate } from './GstPadTemplate';



export type Gstpad_created = (templ: GstPadTemplate, pad: GstPad) => void;

export async function convertGstpad_createdArgs(data: any): Promise<Parameters<Gstpad_created>> {
  return [
    await GstPadTemplate.create(data.templ.ptr, 'none'),
    await GstPad.create(data.pad.ptr, 'none')  ];
}
