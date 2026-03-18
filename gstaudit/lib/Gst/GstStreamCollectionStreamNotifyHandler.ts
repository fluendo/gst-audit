
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GstStream } from './GstStream';
import { GstStreamCollection } from './GstStreamCollection';



export type GstStreamCollectionStreamNotifyHandler = (self: GstStreamCollection, prop_stream: GstStream, prop: GObjectParamSpec) => void;

export async function convertGstStreamCollectionStreamNotifyHandlerArgs(data: any): Promise<Parameters<GstStreamCollectionStreamNotifyHandler>> {
  return [
    await GstStreamCollection.create(data.self.ptr, 'none'),
    await GstStream.create(data.prop_stream.ptr, 'none'),
    await GObjectParamSpec.create(data.prop.ptr, 'none')  ];
}
