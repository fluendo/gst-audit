
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstDeviceProvider } from './GstDeviceProvider';



export type GstDeviceProviderProviderUnhiddenHandler = (self: GstDeviceProvider, object: string) => void;

export async function convertGstDeviceProviderProviderUnhiddenHandlerArgs(data: any): Promise<Parameters<GstDeviceProviderProviderUnhiddenHandler>> {
  return [
    await GstDeviceProvider.create(data.self.ptr, 'none'),
    data.object  ];
}
