
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideohandle_missing_data = (decoder: GstVideoVideoDecoder, duration: number) => void;

export async function convertGstVideohandle_missing_dataArgs(data: any): Promise<Parameters<GstVideohandle_missing_data>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    data.duration  ];
}
