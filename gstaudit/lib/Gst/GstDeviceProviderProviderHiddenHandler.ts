
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstDeviceProvider } from './GstDeviceProvider';



export type GstDeviceProviderProviderHiddenHandler = (self: GstDeviceProvider, object: string) => void;

export async function convertGstDeviceProviderProviderHiddenHandlerArgs(data: any): Promise<Parameters<GstDeviceProviderProviderHiddenHandler>> {
  return [
    await GstDeviceProvider.create(data.self.ptr, 'none'),
    data.object  ];
}
