
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibSource } from './GLibSource';



export type GLibcheck = (source: GLibSource) => void;

export async function convertGLibcheckArgs(data: any): Promise<Parameters<GLibcheck>> {
  return [
    await GLibSource.create(data.source.ptr, 'none')  ];
}
