
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstBaseBaseParseFrame } from './GstBaseBaseParseFrame';



export type GstBasepre_push_frame = (parse: GstBaseBaseParse, frame: GstBaseBaseParseFrame) => void;

export async function convertGstBasepre_push_frameArgs(data: any): Promise<Parameters<GstBasepre_push_frame>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    await GstBaseBaseParseFrame.create(data.frame.ptr, 'none')  ];
}
