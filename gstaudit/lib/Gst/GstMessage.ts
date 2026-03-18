
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibCond } from '../GLib/GLibCond';
import { GObjectValue } from '../GObject/GObjectValue';
import { GstBufferingMode } from './GstBufferingMode';
import type { GstBufferingModeValue } from './GstBufferingMode';
import { GstClock } from './GstClock';
import { GstContext } from './GstContext';
import { GstDevice } from './GstDevice';
import { GstElement } from './GstElement';
import { GstFormat } from './GstFormat';
import type { GstFormatValue } from './GstFormat';
import { GstMessageType } from './GstMessageType';
import type { GstMessageTypeValue } from './GstMessageType';
import { GstMiniObject } from './GstMiniObject';
import { GstObject } from './GstObject';
import { GstProgressType } from './GstProgressType';
import type { GstProgressTypeValue } from './GstProgressType';
import { GstState } from './GstState';
import type { GstStateValue } from './GstState';
import { GstStream } from './GstStream';
import { GstStreamCollection } from './GstStreamCollection';
import { GstStreamStatusType } from './GstStreamStatusType';
import type { GstStreamStatusTypeValue } from './GstStreamStatusType';
import { GstStructure } from './GstStructure';
import { GstStructureChangeType } from './GstStructureChangeType';
import type { GstStructureChangeTypeValue } from './GstStructureChangeType';
import { GstTagList } from './GstTagList';
import { GstToc } from './GstToc';




export class GstMessage extends GstMiniObject {


  protected constructor(ptr: string, transferType: transferType) {
    super(ptr, transferType);
  }

  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstMessage> {
    const instance = new GstMessage(ptr, transferType);
    return instance;
  }
    







 
  static async new_application(structure: GstStructure, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_application`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (structure && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_async_done(running_time: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_async_done`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('running_time', String(running_time));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_async_start(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_async_start`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_buffering(percent: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_buffering`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('percent', String(percent));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_clock_lost(clock: GstClock, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_clock_lost`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_clock_provide(clock: GstClock, ready: boolean, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_clock_provide`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    // Primitive parameter
    url.searchParams.append('ready', String(ready));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_custom(type_: GstMessageTypeValue, src?: GstObject, structure?: GstStructure): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_custom`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (structure !== undefined && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_device_added(device: GstDevice, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_device_added`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_device_changed(device: GstDevice, changed_device: GstDevice, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_device_changed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (changed_device && typeof changed_device === 'object' && 'ptr' in changed_device) {
      url.searchParams.append('changed_device', 'ptr,' + changed_device.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_device_removed(device: GstDevice, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_device_removed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_duration_changed(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_duration_changed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_element(structure: GstStructure, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_element`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (structure && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_eos(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_eos`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_error(error_: Pointer, debug: string, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_error`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_error_with_details(error_: Pointer, debug: string, src?: GstObject, details?: GstStructure): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_error_with_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    // Object with explode=false: serialize as comma-separated
    if (details !== undefined && typeof details === 'object' && 'ptr' in details) {
      url.searchParams.append('details', 'ptr,' + details.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_have_context(context: GstContext, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_have_context`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (context && typeof context === 'object' && 'ptr' in context) {
      url.searchParams.append('context', 'ptr,' + context.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_info(error_: Pointer, debug: string, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_info`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_info_with_details(error_: Pointer, debug: string, src?: GstObject, details?: GstStructure): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_info_with_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    // Object with explode=false: serialize as comma-separated
    if (details !== undefined && typeof details === 'object' && 'ptr' in details) {
      url.searchParams.append('details', 'ptr,' + details.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_instant_rate_request(rate_multiplier: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_instant_rate_request`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('rate_multiplier', String(rate_multiplier));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_latency(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_latency`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_need_context(context_type: string, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_need_context`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('context_type', String(context_type));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_new_clock(clock: GstClock, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_new_clock`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_progress(type_: GstProgressTypeValue, code: string, text: string, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_progress`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Primitive parameter
    url.searchParams.append('code', String(code));
    // Primitive parameter
    url.searchParams.append('text', String(text));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_property_notify(src: GstObject, property_name: string, val?: GObjectValue): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_property_notify`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('property_name', String(property_name));
    // Object with explode=false: serialize as comma-separated
    if (val !== undefined && typeof val === 'object' && 'ptr' in val) {
      url.searchParams.append('val', 'ptr,' + val.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_qos(live: boolean, running_time: number, stream_time: number, timestamp: number, duration: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_qos`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('live', String(live));
    // Primitive parameter
    url.searchParams.append('running_time', String(running_time));
    // Primitive parameter
    url.searchParams.append('stream_time', String(stream_time));
    // Primitive parameter
    url.searchParams.append('timestamp', String(timestamp));
    // Primitive parameter
    url.searchParams.append('duration', String(duration));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_redirect(location: string, src?: GstObject, tag_list?: GstTagList, entry_struct?: GstStructure): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_redirect`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('location', String(location));
    // Object with explode=false: serialize as comma-separated
    if (tag_list !== undefined && typeof tag_list === 'object' && 'ptr' in tag_list) {
      url.searchParams.append('tag_list', 'ptr,' + tag_list.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (entry_struct !== undefined && typeof entry_struct === 'object' && 'ptr' in entry_struct) {
      url.searchParams.append('entry_struct', 'ptr,' + entry_struct.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_request_state(state: GstStateValue, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_request_state`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('state', String(state));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_reset_time(running_time: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_reset_time`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('running_time', String(running_time));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_segment_done(format: GstFormatValue, position: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_segment_done`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    url.searchParams.append('position', String(position));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_segment_start(format: GstFormatValue, position: number, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_segment_start`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    url.searchParams.append('position', String(position));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_state_changed(oldstate: GstStateValue, newstate: GstStateValue, pending: GstStateValue, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_state_changed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('oldstate', String(oldstate));
    // Primitive parameter
    url.searchParams.append('newstate', String(newstate));
    // Primitive parameter
    url.searchParams.append('pending', String(pending));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_state_dirty(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_state_dirty`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_step_done(format: GstFormatValue, amount: number, rate: number, flush: boolean, intermediate: boolean, duration: number, eos: boolean, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_step_done`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    url.searchParams.append('amount', String(amount));
    // Primitive parameter
    url.searchParams.append('rate', String(rate));
    // Primitive parameter
    url.searchParams.append('flush', String(flush));
    // Primitive parameter
    url.searchParams.append('intermediate', String(intermediate));
    // Primitive parameter
    url.searchParams.append('duration', String(duration));
    // Primitive parameter
    url.searchParams.append('eos', String(eos));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_step_start(active: boolean, format: GstFormatValue, amount: number, rate: number, flush: boolean, intermediate: boolean, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_step_start`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('active', String(active));
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    url.searchParams.append('amount', String(amount));
    // Primitive parameter
    url.searchParams.append('rate', String(rate));
    // Primitive parameter
    url.searchParams.append('flush', String(flush));
    // Primitive parameter
    url.searchParams.append('intermediate', String(intermediate));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_stream_collection(collection: GstStreamCollection, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_stream_collection`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      url.searchParams.append('collection', 'ptr,' + collection.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_stream_start(src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_stream_start`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_stream_status(type_: GstStreamStatusTypeValue, owner: GstElement, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_stream_status`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (owner && typeof owner === 'object' && 'ptr' in owner) {
      url.searchParams.append('owner', 'ptr,' + owner.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_streams_selected(collection: GstStreamCollection, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_streams_selected`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      url.searchParams.append('collection', 'ptr,' + collection.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_structure_change(type_: GstStructureChangeTypeValue, owner: GstElement, busy: boolean, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_structure_change`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (owner && typeof owner === 'object' && 'ptr' in owner) {
      url.searchParams.append('owner', 'ptr,' + owner.ptr);
    }
    // Primitive parameter
    url.searchParams.append('busy', String(busy));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_tag(tag_list: GstTagList, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_tag`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (tag_list && typeof tag_list === 'object' && 'ptr' in tag_list) {
      url.searchParams.append('tag_list', 'ptr,' + tag_list.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_toc(toc: GstToc, updated: boolean, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_toc`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (toc && typeof toc === 'object' && 'ptr' in toc) {
      url.searchParams.append('toc', 'ptr,' + toc.ptr);
    }
    // Primitive parameter
    url.searchParams.append('updated', String(updated));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_warning(error_: Pointer, debug: string, src?: GstObject): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_warning`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_warning_with_details(error_: Pointer, debug: string, src?: GstObject, details?: GstStructure): Promise<GstMessage> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/new_warning_with_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (src !== undefined && typeof src === 'object' && 'ptr' in src) {
      url.searchParams.append('src', 'ptr,' + src.ptr);
    }
    // Primitive parameter
    url.searchParams.append('error', String(error_));
    // Primitive parameter
    url.searchParams.append('debug', String(debug));
    // Object with explode=false: serialize as comma-separated
    if (details !== undefined && typeof details === 'object' && 'ptr' in details) {
      url.searchParams.append('details', 'ptr,' + details.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstMessage.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }



    







 
  async add_redirect_entry(location: string, tag_list?: GstTagList, entry_struct?: GstStructure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/add_redirect_entry`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('location', String(location));
    // Object with explode=false: serialize as comma-separated
    if (tag_list !== undefined && typeof tag_list === 'object' && 'ptr' in tag_list) {
      url.searchParams.append('tag_list', 'ptr,' + tag_list.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (entry_struct !== undefined && typeof entry_struct === 'object' && 'ptr' in entry_struct) {
      url.searchParams.append('entry_struct', 'ptr,' + entry_struct.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_num_redirect_entries(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/get_num_redirect_entries`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_seqnum(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/get_seqnum`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_stream_status_object(): Promise<GObjectValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/get_stream_status_object`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GObjectValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_structure(): Promise<GstStructure | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/get_structure`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstStructure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async has_name(name: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/has_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_async_done(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_async_done`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.running_time;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_buffering(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_buffering`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.percent;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_buffering_stats(mode: GstBufferingModeValue): Promise<{avg_in: number, avg_out: number, buffering_left: number}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_buffering_stats`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('mode', String(mode));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: avg_in
      result.avg_in = await (async () => {
        return data.avg_in;

      })();
      // Handle return parameter: avg_out
      result.avg_out = await (async () => {
        return data.avg_out;

      })();
      // Handle return parameter: buffering_left
      result.buffering_left = await (async () => {
        return data.buffering_left;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_clock_lost(clock: GstClock, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_clock_lost`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_clock_provide(clock: GstClock): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_clock_provide`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.ready;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_context_type(): Promise<{context_type: string, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_context_type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: context_type
      result.context_type = await (async () => {
        return data.context_type;

      })();
      // Handle return parameter: return
      result.return = await (async () => {
        return data.return;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_device_added(device: GstDevice, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    if (device && typeof device === 'object' && 'ptr' in device) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_device_added`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

    







 
  async parse_device_changed(device: GstDevice, changed_device: GstDevice, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    if (device && typeof device === 'object' && 'ptr' in device) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/ref').catch(() => {});
    }
    if (changed_device && typeof changed_device === 'object' && 'ptr' in changed_device) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + changed_device.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_device_changed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (changed_device && typeof changed_device === 'object' && 'ptr' in changed_device) {
      url.searchParams.append('changed_device', 'ptr,' + changed_device.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
        if (changed_device && typeof changed_device === 'object' && 'ptr' in changed_device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + changed_device.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
        if (changed_device && typeof changed_device === 'object' && 'ptr' in changed_device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + changed_device.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

    







 
  async parse_device_removed(device: GstDevice, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    if (device && typeof device === 'object' && 'ptr' in device) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_device_removed`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (device && typeof device === 'object' && 'ptr' in device) {
      url.searchParams.append('device', 'ptr,' + device.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
        if (device && typeof device === 'object' && 'ptr' in device) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + device.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

    







 
  async parse_error(): Promise<{gerror: Pointer, debug: string}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_error`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: gerror
      result.gerror = await (async () => {
        return data.gerror;

      })();
      // Handle return parameter: debug
      result.debug = await (async () => {
        return data.debug;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_error_details(structure?: GstStructure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_error_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (structure !== undefined && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_group_id(): Promise<{group_id: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_group_id`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: group_id
      result.group_id = await (async () => {
        return data.group_id;

      })();
      // Handle return parameter: return
      result.return = await (async () => {
        return data.return;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_have_context(context: GstContext, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_have_context`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (context && typeof context === 'object' && 'ptr' in context) {
      url.searchParams.append('context', 'ptr,' + context.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_info(): Promise<{gerror: Pointer, debug: string}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_info`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: gerror
      result.gerror = await (async () => {
        return data.gerror;

      })();
      // Handle return parameter: debug
      result.debug = await (async () => {
        return data.debug;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_info_details(structure?: GstStructure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_info_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (structure !== undefined && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_instant_rate_request(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_instant_rate_request`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.rate_multiplier;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_new_clock(clock: GstClock, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_new_clock`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (clock && typeof clock === 'object' && 'ptr' in clock) {
      url.searchParams.append('clock', 'ptr,' + clock.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_progress(type_: GstProgressTypeValue): Promise<{code: string, text: string}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_progress`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: code
      result.code = await (async () => {
        return data.code;

      })();
      // Handle return parameter: text
      result.text = await (async () => {
        return data.text;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_property_notify(object: GstObject, property_value?: GObjectValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_property_notify`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (object && typeof object === 'object' && 'ptr' in object) {
      url.searchParams.append('object', 'ptr,' + object.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (property_value !== undefined && typeof property_value === 'object' && 'ptr' in property_value) {
      url.searchParams.append('property_value', 'ptr,' + property_value.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.property_name;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_qos(): Promise<{live: boolean, running_time: number, stream_time: number, timestamp: number, duration: number}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_qos`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: live
      result.live = await (async () => {
        return data.live;

      })();
      // Handle return parameter: running_time
      result.running_time = await (async () => {
        return data.running_time;

      })();
      // Handle return parameter: stream_time
      result.stream_time = await (async () => {
        return data.stream_time;

      })();
      // Handle return parameter: timestamp
      result.timestamp = await (async () => {
        return data.timestamp;

      })();
      // Handle return parameter: duration
      result.duration = await (async () => {
        return data.duration;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_qos_stats(format: GstFormatValue): Promise<{processed: number, dropped: number}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_qos_stats`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: processed
      result.processed = await (async () => {
        return data.processed;

      })();
      // Handle return parameter: dropped
      result.dropped = await (async () => {
        return data.dropped;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_qos_values(): Promise<{jitter: number, proportion: number, quality: number}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_qos_values`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: jitter
      result.jitter = await (async () => {
        return data.jitter;

      })();
      // Handle return parameter: proportion
      result.proportion = await (async () => {
        return data.proportion;

      })();
      // Handle return parameter: quality
      result.quality = await (async () => {
        return data.quality;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_redirect_entry(entry_index: number, tag_list?: GstTagList, entry_struct?: GstStructure): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_redirect_entry`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('entry_index', String(entry_index));
    // Object with explode=false: serialize as comma-separated
    if (tag_list !== undefined && typeof tag_list === 'object' && 'ptr' in tag_list) {
      url.searchParams.append('tag_list', 'ptr,' + tag_list.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (entry_struct !== undefined && typeof entry_struct === 'object' && 'ptr' in entry_struct) {
      url.searchParams.append('entry_struct', 'ptr,' + entry_struct.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.location;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_request_state(state: GstStateValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_request_state`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('state', String(state));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_reset_time(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_reset_time`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.running_time;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_segment_done(format: GstFormatValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_segment_done`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.position;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_segment_start(format: GstFormatValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_segment_start`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.position;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_state_changed(oldstate: GstStateValue, newstate: GstStateValue, pending: GstStateValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_state_changed`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('oldstate', String(oldstate));
    // Primitive parameter
    url.searchParams.append('newstate', String(newstate));
    // Primitive parameter
    url.searchParams.append('pending', String(pending));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_step_done(format: GstFormatValue): Promise<{amount: number, rate: number, flush: boolean, intermediate: boolean, duration: number, eos: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_step_done`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: amount
      result.amount = await (async () => {
        return data.amount;

      })();
      // Handle return parameter: rate
      result.rate = await (async () => {
        return data.rate;

      })();
      // Handle return parameter: flush
      result.flush = await (async () => {
        return data.flush;

      })();
      // Handle return parameter: intermediate
      result.intermediate = await (async () => {
        return data.intermediate;

      })();
      // Handle return parameter: duration
      result.duration = await (async () => {
        return data.duration;

      })();
      // Handle return parameter: eos
      result.eos = await (async () => {
        return data.eos;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_step_start(format: GstFormatValue): Promise<{active: boolean, amount: number, rate: number, flush: boolean, intermediate: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_step_start`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: active
      result.active = await (async () => {
        return data.active;

      })();
      // Handle return parameter: amount
      result.amount = await (async () => {
        return data.amount;

      })();
      // Handle return parameter: rate
      result.rate = await (async () => {
        return data.rate;

      })();
      // Handle return parameter: flush
      result.flush = await (async () => {
        return data.flush;

      })();
      // Handle return parameter: intermediate
      result.intermediate = await (async () => {
        return data.intermediate;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_stream_collection(collection: GstStreamCollection, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_stream_collection`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      url.searchParams.append('collection', 'ptr,' + collection.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        if (collection && typeof collection === 'object' && 'ptr' in collection) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
        if (collection && typeof collection === 'object' && 'ptr' in collection) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

    







 
  async parse_stream_status(type_: GstStreamStatusTypeValue, owner: GstElement, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_stream_status`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (owner && typeof owner === 'object' && 'ptr' in owner) {
      url.searchParams.append('owner', 'ptr,' + owner.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_streams_selected(collection: GstStreamCollection, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/ref').catch(() => {});
    }
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_streams_selected`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (collection && typeof collection === 'object' && 'ptr' in collection) {
      url.searchParams.append('collection', 'ptr,' + collection.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        if (collection && typeof collection === 'object' && 'ptr' in collection) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/unref').catch(() => {});
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
        if (collection && typeof collection === 'object' && 'ptr' in collection) {
          await fetch(apiConfig.fullBaseUrl + '/GObject/Object/' + collection.ptr + '/unref').catch(() => {});
        }
      throw error;
    }
  }

    







 
  async parse_structure_change(type_: GstStructureChangeTypeValue, owner: GstElement): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_structure_change`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (owner && typeof owner === 'object' && 'ptr' in owner) {
      url.searchParams.append('owner', 'ptr,' + owner.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.busy;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_tag(tag_list: GstTagList, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_tag`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (tag_list && typeof tag_list === 'object' && 'ptr' in tag_list) {
      url.searchParams.append('tag_list', 'ptr,' + tag_list.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_toc(toc: GstToc): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_toc`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (toc && typeof toc === 'object' && 'ptr' in toc) {
      url.searchParams.append('toc', 'ptr,' + toc.ptr);
    }
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.updated;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_warning(): Promise<{gerror: Pointer, debug: string}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_warning`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
        const result: any = {};
      // Handle return parameter: gerror
      result.gerror = await (async () => {
        return data.gerror;

      })();
      // Handle return parameter: debug
      result.debug = await (async () => {
        return data.debug;

      })();
      return result;

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async parse_warning_details(structure?: GstStructure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/parse_warning_details`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (structure !== undefined && typeof structure === 'object' && 'ptr' in structure) {
      url.searchParams.append('structure', 'ptr,' + structure.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_buffering_stats(mode: GstBufferingModeValue, avg_in: number, avg_out: number, buffering_left: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_buffering_stats`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('mode', String(mode));
    // Primitive parameter
    url.searchParams.append('avg_in', String(avg_in));
    // Primitive parameter
    url.searchParams.append('avg_out', String(avg_out));
    // Primitive parameter
    url.searchParams.append('buffering_left', String(buffering_left));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_group_id(group_id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_group_id`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('group_id', String(group_id));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_qos_stats(format: GstFormatValue, processed: number, dropped: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_qos_stats`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('format', String(format));
    // Primitive parameter
    url.searchParams.append('processed', String(processed));
    // Primitive parameter
    url.searchParams.append('dropped', String(dropped));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_qos_values(jitter: number, proportion: number, quality: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_qos_values`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('jitter', String(jitter));
    // Primitive parameter
    url.searchParams.append('proportion', String(proportion));
    // Primitive parameter
    url.searchParams.append('quality', String(quality));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_seqnum(seqnum: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_seqnum`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('seqnum', String(seqnum));
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async set_stream_status_object(object: GObjectValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/set_stream_status_object`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (object && typeof object === 'object' && 'ptr' in object) {
      url.searchParams.append('object', 'ptr,' + object.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async streams_selected_add(stream: GstStream, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/streams_selected_add`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (stream && typeof stream === 'object' && 'ptr' in stream) {
      url.searchParams.append('stream', 'ptr,' + stream.ptr);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async streams_selected_get_size(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/streams_selected_get_size`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async streams_selected_get_stream(idx: number): Promise<GstStream | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/streams_selected_get_stream`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('idx', String(idx));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        if (data.return.ptr === null) {
          return null;
        }
        // Use static factory method to properly await ref counting
const instance = await GstStream.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async writable_structure(): Promise<GstStructure> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/writable_structure`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GstStructure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_mini_object(): Promise<GstMiniObject | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/mini_object`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstMiniObject.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_type(): Promise<GstMessageTypeValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_timestamp(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/timestamp`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_src(): Promise<GstObject | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/src`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        if (data.return.ptr === null) {
          return null;
        }
        // Use static factory method to properly await ref counting
const instance = await GstObject.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_lock(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/lock`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_cond(): Promise<GLibCond | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/ptr,${this.ptr}/fields/cond`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GLibCond.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Message/get_type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

}

