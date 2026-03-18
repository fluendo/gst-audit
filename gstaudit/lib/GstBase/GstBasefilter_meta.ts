
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseTransform } from './GstBaseBaseTransform';
import { GstQuery } from '../Gst/GstQuery';
import { GstStructure } from '../Gst/GstStructure';



export type GstBasefilter_meta = (trans: GstBaseBaseTransform, query: GstQuery, api: string, params: GstStructure) => void;

export async function convertGstBasefilter_metaArgs(data: any): Promise<Parameters<GstBasefilter_meta>> {
  return [
    await GstBaseBaseTransform.create(data.trans.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none'),
    data.api,
    await GstStructure.create(data.params.ptr, 'none')  ];
}
