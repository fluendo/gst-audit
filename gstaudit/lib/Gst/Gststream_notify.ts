
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectParamSpec } from '../GObject/GObjectParamSpec';
import { GstStream } from './GstStream';
import { GstStreamCollection } from './GstStreamCollection';



export type Gststream_notify = (collection: GstStreamCollection, stream: GstStream, pspec: GObjectParamSpec) => void;

export async function convertGststream_notifyArgs(data: any): Promise<Parameters<Gststream_notify>> {
  return [
    await GstStreamCollection.create(data.collection.ptr, 'none'),
    await GstStream.create(data.stream.ptr, 'none'),
    await GObjectParamSpec.create(data.pspec.ptr, 'none')  ];
}
