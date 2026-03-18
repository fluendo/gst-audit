
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type Gstget_length = (data_: Pointer) => void;

export async function convertGstget_lengthArgs(data: any): Promise<Parameters<Gstget_length>> {
  return [
    data.data  ];
}
