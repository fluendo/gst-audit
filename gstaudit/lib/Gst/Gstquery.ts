
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstElement } from './GstElement';
import { GstQuery } from './GstQuery';



export type Gstquery = (element: GstElement, query: GstQuery) => void;

export async function convertGstqueryArgs(data: any): Promise<Parameters<Gstquery>> {
  return [
    await GstElement.create(data.element.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
