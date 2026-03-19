
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstBaseBaseParse } from './GstBaseBaseParse';
import { GstFormat } from '../Gst/GstFormat';
import type { GstFormatValue } from '../Gst/GstFormat';



export type GstBaseconvert = (parse: GstBaseBaseParse, src_format: GstFormatValue, src_value: number, dest_format: GstFormatValue, dest_value: number) => void;

export async function convertGstBaseconvertArgs(data: any): Promise<Parameters<GstBaseconvert>> {
  return [
    await GstBaseBaseParse.create(data.parse.ptr, 'none'),
    data.src_format,
    data.src_value,
    data.dest_format,
    data.dest_value  ];
}
