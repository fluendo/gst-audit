
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoCodecState } from './GstVideoVideoCodecState';
import { GstVideoVideoDecoder } from './GstVideoVideoDecoder';



export type GstVideoset_format = (decoder: GstVideoVideoDecoder, state: GstVideoVideoCodecState) => void;

export async function convertGstVideoset_formatArgs(data: any): Promise<Parameters<GstVideoset_format>> {
  return [
    await GstVideoVideoDecoder.create(data.decoder.ptr, 'none'),
    await GstVideoVideoCodecState.create(data.state.ptr, 'none')  ];
}
