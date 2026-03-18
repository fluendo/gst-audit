
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseAggregator } from './GstBaseAggregator';
import { GstPadMode } from '../Gst/GstPadMode';
import type { GstPadModeValue } from '../Gst/GstPadMode';



export type GstBasesrc_activate = (aggregator: GstBaseAggregator, mode: GstPadModeValue, active: boolean) => void;

export async function convertGstBasesrc_activateArgs(data: any): Promise<Parameters<GstBasesrc_activate>> {
  return [
    await GstBaseAggregator.create(data.aggregator.ptr, 'none'),
    data.mode,
    data.active  ];
}
