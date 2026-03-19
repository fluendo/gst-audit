
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstAllocationParams } from './GstAllocationParams';
import { GstAllocator } from './GstAllocator';



export type Gstalloc = (allocator: GstAllocator, size: number, params: GstAllocationParams) => void;

export async function convertGstallocArgs(data: any): Promise<Parameters<Gstalloc>> {
  return [
    await GstAllocator.create(data.allocator.ptr, 'none'),
    data.size,
    await GstAllocationParams.create(data.params.ptr, 'none')  ];
}
