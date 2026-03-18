
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GstTaskFunction = (user_data: Pointer) => void;

export async function convertGstTaskFunctionArgs(data: any): Promise<Parameters<GstTaskFunction>> {
  return [
    data.user_data  ];
}
