
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from './GstObject';
import { GstPad } from './GstPad';
import { GstQuery } from './GstQuery';



export type GstPadQueryFunction = (pad: GstPad, parent: GstObject, query: GstQuery) => void;

export async function convertGstPadQueryFunctionArgs(data: any): Promise<Parameters<GstPadQueryFunction>> {
  return [
    await GstPad.create(data.pad.ptr, 'none'),
    await GstObject.create(data.parent.ptr, 'none'),
    await GstQuery.create(data.query.ptr, 'none')  ];
}
