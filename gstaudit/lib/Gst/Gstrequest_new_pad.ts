
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCaps } from './GstCaps';
import { GstElement } from './GstElement';
import { GstPadTemplate } from './GstPadTemplate';



export type Gstrequest_new_pad = (element: GstElement, templ: GstPadTemplate, name: string, caps: GstCaps) => void;

export async function convertGstrequest_new_padArgs(data: any): Promise<Parameters<Gstrequest_new_pad>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstPadTemplate.create(data.templ.ptr, 'none'),
    data.name,
    await GstCaps.create(data.caps.ptr, 'none')  ];
}
