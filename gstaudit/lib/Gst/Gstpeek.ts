
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type Gstpeek = (data_: Pointer, offset: number, size: number) => void;

export async function convertGstpeekArgs(data: any): Promise<Parameters<Gstpeek>> {
  return [
    data.data,
    data.offset,
    data.size  ];
}
