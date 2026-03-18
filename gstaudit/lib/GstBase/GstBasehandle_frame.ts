
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstBaseBaseParseFrame } from './GstBaseBaseParseFrame';



export type GstBasehandle_frame = (parse: GstBaseBaseParse, frame: GstBaseBaseParseFrame) => void;

export async function convertGstBasehandle_frameArgs(data: any): Promise<Parameters<GstBasehandle_frame>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    await GstBaseBaseParseFrame.create(data.frame.ptr, 'none')  ];
}
