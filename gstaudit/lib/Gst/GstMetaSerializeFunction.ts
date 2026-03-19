
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstByteArrayInterface } from './GstByteArrayInterface';
import { GstMeta } from './GstMeta';



export type GstMetaSerializeFunction = (meta: GstMeta, data_: GstByteArrayInterface) => void;

export async function convertGstMetaSerializeFunctionArgs(data: any): Promise<Parameters<GstMetaSerializeFunction>> {
  return [
    await GstMeta.create(data.meta.ptr, 'none'),
    await GstByteArrayInterface.create(data.data.ptr, 'none')  ];
}
