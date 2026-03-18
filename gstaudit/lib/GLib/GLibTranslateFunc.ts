
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports



export type GLibTranslateFunc = (str: string, data_: Pointer) => void;

export async function convertGLibTranslateFuncArgs(data: any): Promise<Parameters<GLibTranslateFunc>> {
  return [
    data.str,
    data.data  ];
}
