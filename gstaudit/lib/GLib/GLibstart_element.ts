
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibMarkupParseContext } from './GLibMarkupParseContext';



export type GLibstart_element = (context: GLibMarkupParseContext, element_name: string, attribute_names: string, attribute_values: string, user_data: Pointer) => void;

export async function convertGLibstart_elementArgs(data: any): Promise<Parameters<GLibstart_element>> {
  return [
    await GLibMarkupParseContext.create(data.context.ptr, 'none'),
    data.element_name,
    data.attribute_names,
    data.attribute_values,
    data.user_data  ];
}
