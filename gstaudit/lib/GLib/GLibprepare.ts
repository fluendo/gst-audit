
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibSource } from './GLibSource';



export type GLibprepare = (source: GLibSource, timeout_: number) => void;

export async function convertGLibprepareArgs(data: any): Promise<Parameters<GLibprepare>> {
  return [
    await GLibSource.create(data.source.ptr, 'none'),
    data.timeout_  ];
}
