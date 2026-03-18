
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from './GObjectObject';
import { GObjectParamSpec } from './GObjectParamSpec';
import { GObjectValue } from './GObjectValue';



export type GObjectget_property = (object: GObjectObject, property_id: number, value_: GObjectValue, pspec: GObjectParamSpec) => void;

export async function convertGObjectget_propertyArgs(data: any): Promise<Parameters<GObjectget_property>> {
  return [
    await GObjectObject.create(data.object.ptr, 'none'),
    data.property_id,
    await GObjectValue.create(data.value.ptr, 'none'),
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
