
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibThread } from '../GLib/GLibThread';
import { GstTask } from './GstTask';



export type GstTaskThreadFunc = (task: GstTask, thread: GLibThread, user_data: Pointer) => void;

export async function convertGstTaskThreadFuncArgs(data: any): Promise<Parameters<GstTaskThreadFunc>> {
  return [
    await GstTask.create(data.task.ptr, 'none'),
    await GLibThread.create(data.thread.ptr, 'none'),
    data.user_data  ];
}
