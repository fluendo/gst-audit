
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibTreeNode } from './GLibTreeNode';



export type GLibTraverseNodeFunc = (node: GLibTreeNode, data_: Pointer) => void;

export async function convertGLibTraverseNodeFuncArgs(data: any): Promise<Parameters<GLibTraverseNodeFunc>> {
  return [
    await GLibTreeNode.create(data.node.ptr, 'none'),
    data.data  ];
}
