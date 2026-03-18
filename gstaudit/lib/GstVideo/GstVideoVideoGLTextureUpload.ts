
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstVideoVideoGLTextureUploadMeta } from './GstVideoVideoGLTextureUploadMeta';



export type GstVideoVideoGLTextureUpload = (meta: GstVideoVideoGLTextureUploadMeta, texture_id: number) => void;

export async function convertGstVideoVideoGLTextureUploadArgs(data: any): Promise<Parameters<GstVideoVideoGLTextureUpload>> {
  return [
    await GstVideoVideoGLTextureUploadMeta.create(data.meta.ptr, 'none'),
    data.texture_id  ];
}
