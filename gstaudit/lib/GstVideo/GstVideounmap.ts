
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstMapInfo } from '../Gst/GstMapInfo';
import { GstVideoVideoMeta } from './GstVideoVideoMeta';



export type GstVideounmap = (meta: GstVideoVideoMeta, plane: number, info: GstMapInfo) => void;

export async function convertGstVideounmapArgs(data: any): Promise<Parameters<GstVideounmap>> {
  return [
    await GstVideoVideoMeta.create(data.meta.ptr, 'none'),
    data.plane,
    await GstMapInfo.create(data.info.ptr, 'none')  ];
}
