
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstDevice } from './GstDevice';
import { GstElement } from './GstElement';



export type Gstreconfigure_element = (device: GstDevice, element: GstElement) => void;

export async function convertGstreconfigure_elementArgs(data: any): Promise<Parameters<Gstreconfigure_element>> {
  return [
    await GstDevice.create(data.device.ptr, 'none'),
    await GstElement.create(data.element.ptr, 'none')  ];
}
