
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibMatchInfo } from './GLibMatchInfo';
import { GLibString } from './GLibString';



export type GLibRegexEvalCallback = (match_info: GLibMatchInfo, result_: GLibString, user_data: Pointer) => void;

export async function convertGLibRegexEvalCallbackArgs(data: any): Promise<Parameters<GLibRegexEvalCallback>> {
  return [
    await GLibMatchInfo.create(data.match_info.ptr, 'none'),
    await GLibString.create(data.result.ptr, 'none'),
    data.user_data  ];
}
