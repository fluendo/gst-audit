
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';



export type GstElementNoMorePadsHandler = (self: GstElement) => void;

export async function convertGstElementNoMorePadsHandlerArgs(data: any): Promise<Parameters<GstElementNoMorePadsHandler>> {
  return [
    await GstElement.create(data.self.ptr, 'none')  ];
}
