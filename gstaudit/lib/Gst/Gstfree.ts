
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstAllocator } from './GstAllocator';
import { GstMemory } from './GstMemory';



export type Gstfree = (allocator: GstAllocator, memory: GstMemory) => void;

export async function convertGstfreeArgs(data: any): Promise<Parameters<Gstfree>> {
  return [
    await GstAllocator.create(data.allocator.ptr, 'none'),
    await GstMemory.create(data.memory.ptr, 'full')  ];
}
