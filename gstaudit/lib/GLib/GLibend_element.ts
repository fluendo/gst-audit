
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibMarkupParseContext } from './GLibMarkupParseContext';



export type GLibend_element = (context: GLibMarkupParseContext, element_name: string, user_data: Pointer) => void;

export async function convertGLibend_elementArgs(data: any): Promise<Parameters<GLibend_element>> {
  return [
    await GLibMarkupParseContext.create(data.context.ptr, 'none'),
    data.element_name,
    data.user_data  ];
}
