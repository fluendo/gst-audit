
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibMarkupParseContext } from './GLibMarkupParseContext';



export type GLiberror = (context: GLibMarkupParseContext, error_: Pointer, user_data: Pointer) => void;

export async function convertGLiberrorArgs(data: any): Promise<Parameters<GLiberror>> {
  return [
    await GLibMarkupParseContext.create(data.context.ptr, 'none'),
    data.error,
    data.user_data  ];
}
