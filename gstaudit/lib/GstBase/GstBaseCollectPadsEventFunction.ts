
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseCollectData } from './GstBaseCollectData';
import { GstBaseCollectPads } from './GstBaseCollectPads';
import { GstEvent } from '../Gst/GstEvent';



export type GstBaseCollectPadsEventFunction = (pads: GstBaseCollectPads, pad: GstBaseCollectData, event: GstEvent, user_data: Pointer) => void;

export async function convertGstBaseCollectPadsEventFunctionArgs(data: any): Promise<Parameters<GstBaseCollectPadsEventFunction>> {
  return [
    await GstBaseCollectPads.create(data.pads.ptr, 'none'),
    await GstBaseCollectData.create(data.pad.ptr, 'none'),
    await GstEvent.create(data.event.ptr, 'none'),
    data.user_data  ];
}
