
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibScanner } from './GLibScanner';



export type GLibScannerMsgFunc = (scanner: GLibScanner, message: string, error_: boolean) => void;

export async function convertGLibScannerMsgFuncArgs(data: any): Promise<Parameters<GLibScannerMsgFunc>> {
  return [
    await GLibScanner.create(data.scanner.ptr, 'none'),
    data.message,
    data.error  ];
}
