
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectObject } from '../GObject/GObjectObject';
import { GstDebugCategory } from './GstDebugCategory';
import { GstDebugLevel } from './GstDebugLevel';
import type { GstDebugLevelValue } from './GstDebugLevel';
import { GstDebugMessage } from './GstDebugMessage';



export type GstLogFunction = (category: GstDebugCategory, level: GstDebugLevelValue, file: string, function_: string, line: number, object: GObjectObject, message: GstDebugMessage, user_data: Pointer) => void;

export async function convertGstLogFunctionArgs(data: any): Promise<Parameters<GstLogFunction>> {
  return [
    await GstDebugCategory.create(data.category.ptr, 'none'),
    data.level,
    data.file,
    data.function,
    data.line,
    await GObjectObject.create(data.object.ptr, 'none'),
    await GstDebugMessage.create(data.message.ptr, 'none'),
    data.user_data  ];
}
