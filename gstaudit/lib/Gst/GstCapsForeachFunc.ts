
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstCapsFeatures } from './GstCapsFeatures';
import { GstStructure } from './GstStructure';



export type GstCapsForeachFunc = (features: GstCapsFeatures, structure: GstStructure, user_data: Pointer) => void;

export async function convertGstCapsForeachFuncArgs(data: any): Promise<Parameters<GstCapsForeachFunc>> {
  return [
    await GstCapsFeatures.create(data.features.ptr, 'none'),
    await GstStructure.create(data.structure.ptr, 'none'),
    data.user_data  ];
}
