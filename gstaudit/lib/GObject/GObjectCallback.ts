
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GObjectCallback = () => void;

export async function convertGObjectCallbackArgs(data: any): Promise<Parameters<GObjectCallback>> {
  return [
  ];
}
