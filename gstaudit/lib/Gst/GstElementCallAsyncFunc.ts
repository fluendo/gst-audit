
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';



export type GstElementCallAsyncFunc = (element: GstElement, user_data: Pointer) => void;

export async function convertGstElementCallAsyncFuncArgs(data: any): Promise<Parameters<GstElementCallAsyncFunc>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    data.user_data  ];
}
