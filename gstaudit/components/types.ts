/**
 * Shared types for node components and callback system
 */

export interface PadConnectionInfo {
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandleId: string;
  targetHandleId: string;
  sourcePadPtr: string;
  targetPadPtr: string;
  // Indicates which pad reported this connection
  reportedBy: 'source' | 'target';
  // Indicates if this is an internal connection (ghost pad's internal pad to/from internal element)
  isInternal: boolean;
}