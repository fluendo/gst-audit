
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibSequenceIter } from './GLibSequenceIter';



export type GLibSequenceIterCompareFunc = (a: GLibSequenceIter, b: GLibSequenceIter, data_: Pointer) => void;

export async function convertGLibSequenceIterCompareFuncArgs(data: any): Promise<Parameters<GLibSequenceIterCompareFunc>> {
  return [
    await GLibSequenceIter.create(data.a.ptr, 'none'),
    await GLibSequenceIter.create(data.b.ptr, 'none'),
    data.data  ];
}
