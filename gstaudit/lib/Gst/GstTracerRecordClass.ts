
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObjectClass } from './GstObjectClass';




export class GstTracerRecordClass extends GstObjectClass {


  protected constructor(ptr: string, transferType: transferType) {
    super(ptr, transferType);
  }

  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstTracerRecordClass> {
    const instance = new GstTracerRecordClass(ptr, transferType);
    return instance;
  }


}

