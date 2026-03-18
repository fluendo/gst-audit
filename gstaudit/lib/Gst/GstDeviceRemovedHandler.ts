
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstDevice } from './GstDevice';



export type GstDeviceRemovedHandler = (self: GstDevice) => void;

export async function convertGstDeviceRemovedHandlerArgs(data: any): Promise<Parameters<GstDeviceRemovedHandler>> {
  return [
    await GstDevice.create(data.self.ptr, 'none')  ];
}
