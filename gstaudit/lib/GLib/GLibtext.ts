
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibMarkupParseContext } from './GLibMarkupParseContext';



export type GLibtext = (context: GLibMarkupParseContext, text: string, text_len: number, user_data: Pointer) => void;

export async function convertGLibtextArgs(data: any): Promise<Parameters<GLibtext>> {
  return [
    await GLibMarkupParseContext.create(data.context.ptr, 'none'),
    data.text,
    data.text_len,
    data.user_data  ];
}
