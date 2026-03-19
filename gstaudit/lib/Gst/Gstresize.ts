
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstByteArrayInterface } from './GstByteArrayInterface';



export type Gstresize = (self: GstByteArrayInterface, length: number) => void;

export async function convertGstresizeArgs(data: any): Promise<Parameters<Gstresize>> {
  return [
    await GstByteArrayInterface.create(data.self.ptr, 'none'),
    data.length  ];
}
