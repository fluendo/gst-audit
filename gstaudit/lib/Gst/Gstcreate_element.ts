
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstDevice } from './GstDevice';



export type Gstcreate_element = (device: GstDevice, name: string) => void;

export async function convertGstcreate_elementArgs(data: any): Promise<Parameters<Gstcreate_element>> {
  return [
    await GstDevice.create(data.device.ptr, 'none'),
    data.name  ];
}
