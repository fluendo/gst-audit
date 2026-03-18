
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectSignalInvocationHint } from './GObjectSignalInvocationHint';
import { GObjectValue } from './GObjectValue';



export type GObjectSignalAccumulator = (ihint: GObjectSignalInvocationHint, return_accu: GObjectValue, handler_return: GObjectValue, data_: Pointer) => void;

export async function convertGObjectSignalAccumulatorArgs(data: any): Promise<Parameters<GObjectSignalAccumulator>> {
  return [
    await GObjectSignalInvocationHint.create(data.ihint.ptr, 'none'),
    await GObjectValue.create(data.return_accu.ptr, 'none'),
    await GObjectValue.create(data.handler_return.ptr, 'none'),
    data.data  ];
}
