
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstControlBinding } from './GstControlBinding';



export type Gstget_value = (binding: GstControlBinding) => void;

export async function convertGstget_valueArgs(data: any): Promise<Parameters<Gstget_value>> {
  return [
    await GstControlBinding.create(data.binding.ptr, 'none')  ];
}
