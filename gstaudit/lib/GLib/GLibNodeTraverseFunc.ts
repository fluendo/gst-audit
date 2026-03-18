
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibNode } from './GLibNode';



export type GLibNodeTraverseFunc = (node: GLibNode, data_: Pointer) => void;

export async function convertGLibNodeTraverseFuncArgs(data: any): Promise<Parameters<GLibNodeTraverseFunc>> {
  return [
    await GLibNode.create(data.node.ptr, 'none'),
    data.data  ];
}
