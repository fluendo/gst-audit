
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GstTaskPoolFunction = (user_data: Pointer) => void;

export async function convertGstTaskPoolFunctionArgs(data: any): Promise<Parameters<GstTaskPoolFunction>> {
  return [
    data.user_data  ];
}
