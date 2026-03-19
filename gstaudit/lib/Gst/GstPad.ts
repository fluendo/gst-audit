
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GObjectConnectFlags } from '../GObject/GObjectConnectFlags';
import { GstBuffer } from './GstBuffer';
import { GstBufferList } from './GstBufferList';
import { GstCaps } from './GstCaps';
import { GstElement } from './GstElement';
import { GstEvent } from './GstEvent';
import { GstEventType } from './GstEventType';
import type { GstEventTypeValue } from './GstEventType';
import { GstFlowReturn } from './GstFlowReturn';
import type { GstFlowReturnValue } from './GstFlowReturn';
import { GstFormat } from './GstFormat';
import type { GstFormatValue } from './GstFormat';
import { GstIterator } from './GstIterator';
import { GstObject } from './GstObject';
import type { GstPadActivateFunction } from './GstPadActivateFunction';
import { convertGstPadActivateFunctionArgs } from './GstPadActivateFunction';
import type { GstPadActivateModeFunction } from './GstPadActivateModeFunction';
import { convertGstPadActivateModeFunctionArgs } from './GstPadActivateModeFunction';
import type { GstPadChainFunction } from './GstPadChainFunction';
import { convertGstPadChainFunctionArgs } from './GstPadChainFunction';
import type { GstPadChainListFunction } from './GstPadChainListFunction';
import { convertGstPadChainListFunctionArgs } from './GstPadChainListFunction';
import { GstPadDirection } from './GstPadDirection';
import type { GstPadDirectionValue } from './GstPadDirection';
import type { GstPadEventFullFunction } from './GstPadEventFullFunction';
import { convertGstPadEventFullFunctionArgs } from './GstPadEventFullFunction';
import type { GstPadEventFunction } from './GstPadEventFunction';
import { convertGstPadEventFunctionArgs } from './GstPadEventFunction';
import type { GstPadForwardFunction } from './GstPadForwardFunction';
import { convertGstPadForwardFunctionArgs } from './GstPadForwardFunction';
import type { GstPadGetRangeFunction } from './GstPadGetRangeFunction';
import { convertGstPadGetRangeFunctionArgs } from './GstPadGetRangeFunction';
import type { GstPadIterIntLinkFunction } from './GstPadIterIntLinkFunction';
import { convertGstPadIterIntLinkFunctionArgs } from './GstPadIterIntLinkFunction';
import { GstPadLinkCheck } from './GstPadLinkCheck';
import type { GstPadLinkCheckValue } from './GstPadLinkCheck';
import type { GstPadLinkFunction } from './GstPadLinkFunction';
import { convertGstPadLinkFunctionArgs } from './GstPadLinkFunction';
import { GstPadLinkReturn } from './GstPadLinkReturn';
import type { GstPadLinkReturnValue } from './GstPadLinkReturn';
import type { GstPadLinkedHandler } from './GstPadLinkedHandler';
import { convertGstPadLinkedHandlerArgs } from './GstPadLinkedHandler';
import { GstPadMode } from './GstPadMode';
import type { GstPadModeValue } from './GstPadMode';
import type { GstPadProbeCallback } from './GstPadProbeCallback';
import { convertGstPadProbeCallbackArgs } from './GstPadProbeCallback';
import { GstPadProbeType } from './GstPadProbeType';
import type { GstPadProbeTypeValue } from './GstPadProbeType';
import type { GstPadQueryFunction } from './GstPadQueryFunction';
import { convertGstPadQueryFunctionArgs } from './GstPadQueryFunction';
import type { GstPadStickyEventsForeachFunction } from './GstPadStickyEventsForeachFunction';
import { convertGstPadStickyEventsForeachFunctionArgs } from './GstPadStickyEventsForeachFunction';
import { GstPadTemplate } from './GstPadTemplate';
import type { GstPadUnlinkFunction } from './GstPadUnlinkFunction';
import { convertGstPadUnlinkFunctionArgs } from './GstPadUnlinkFunction';
import type { GstPadUnlinkedHandler } from './GstPadUnlinkedHandler';
import { convertGstPadUnlinkedHandlerArgs } from './GstPadUnlinkedHandler';
import { GstQuery } from './GstQuery';
import { GstStaticPadTemplate } from './GstStaticPadTemplate';
import { GstStream } from './GstStream';
import type { GstTaskFunction } from './GstTaskFunction';
import { convertGstTaskFunctionArgs } from './GstTaskFunction';
import { GstTaskState } from './GstTaskState';
import type { GstTaskStateValue } from './GstTaskState';




export class GstPad extends GstObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstPad> {
    const instance = new GstPad(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }

    







 
  static async new(direction: GstPadDirectionValue, name?: string): Promise<GstPad> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/new`, apiConfig.baseUrl);
    // Primitive parameter
    if (name !== undefined) url.searchParams.append('name', String(name));
    // Primitive parameter
    url.searchParams.append('direction', String(direction));
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
        // Use static factory method to properly await ref counting
const instance = await GstPad.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_from_static_template(templ: GstStaticPadTemplate, name: string): Promise<GstPad> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/new_from_static_template`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (templ && typeof templ === 'object' && 'ptr' in templ) {
      url.searchParams.append('templ', 'ptr,' + templ.ptr);
    }
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GstPad.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  static async new_from_template(templ: GstPadTemplate, name?: string): Promise<GstPad> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/new_from_template`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (templ && typeof templ === 'object' && 'ptr' in templ) {
      url.searchParams.append('templ', 'ptr,' + templ.ptr);
    }
    // Primitive parameter
    if (name !== undefined) url.searchParams.append('name', String(name));
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
        // Use static factory method to properly await ref counting
const instance = await GstPad.create(data.return.ptr, 'none');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }



      







 
  static async link_get_name(ret: GstPadLinkReturnValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/link_get_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('ret', String(ret));
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

      







 
  async activate_mode(mode: GstPadModeValue, active: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/activate_mode`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('mode', String(mode));
    // Primitive parameter
    url.searchParams.append('active', String(active));
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

      







 
  async add_probe(mask: GstPadProbeTypeValue, session_id: string, callback_secret: string, callback: GstPadProbeCallback): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/add_probe`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('mask', String(mask));
    // Register callback using the callback handler
    let callback_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof callback !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      callback_callbackInfo = callbackHandler.registerCallback(
        callback, 
        convertGstPadProbeCallbackArgs,
        {
          methodName: 'add_probe',
          paramName: 'callback'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('callback', callback_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async can_link(sinkpad: GstPad): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/can_link`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sinkpad && typeof sinkpad === 'object' && 'ptr' in sinkpad) {
      url.searchParams.append('sinkpad', 'ptr,' + sinkpad.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async chain(buffer: GstBuffer): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/chain`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async chain_list(list: GstBufferList): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/chain_list`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (list && typeof list === 'object' && 'ptr' in list) {
      url.searchParams.append('list', 'ptr,' + list.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async check_reconfigure(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/check_reconfigure`, apiConfig.baseUrl);
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

      







 
  async create_stream_id(parent: GstElement, stream_id?: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/create_stream_id`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Primitive parameter
    if (stream_id !== undefined) url.searchParams.append('stream_id', String(stream_id));
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

      







 
  async event_default(event: GstEvent, parent?: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/event_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (event && typeof event === 'object' && 'ptr' in event) {
      url.searchParams.append('event', 'ptr,' + event.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async forward(session_id: string, callback_secret: string, forward: GstPadForwardFunction): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/forward`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let forward_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof forward !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      forward_callbackInfo = callbackHandler.registerCallback(
        forward, 
        convertGstPadForwardFunctionArgs,
        {
          methodName: 'forward',
          paramName: 'forward'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('forward', forward_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_allowed_caps(): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_allowed_caps`, apiConfig.baseUrl);
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_current_caps(): Promise<GstCaps | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_current_caps`, apiConfig.baseUrl);
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_direction(): Promise<GstPadDirectionValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_direction`, apiConfig.baseUrl);
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

      







 
  async get_element_private(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_element_private`, apiConfig.baseUrl);
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

      







 
  async get_last_flow_return(): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_last_flow_return`, apiConfig.baseUrl);
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

      







 
  async get_offset(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_offset`, apiConfig.baseUrl);
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

      







 
  async get_pad_template(): Promise<GstPadTemplate | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_pad_template`, apiConfig.baseUrl);
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
const instance = await GstPadTemplate.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_pad_template_caps(): Promise<GstCaps> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_pad_template_caps`, apiConfig.baseUrl);
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_parent_element(): Promise<GstElement | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_parent_element`, apiConfig.baseUrl);
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
const instance = await GstElement.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_peer(): Promise<GstPad | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_peer`, apiConfig.baseUrl);
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
const instance = await GstPad.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_range(offset: number, size: number, buffer: GstBuffer): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_range`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_single_internal_link(): Promise<GstPad | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_single_internal_link`, apiConfig.baseUrl);
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
const instance = await GstPad.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_sticky_event(event_type: GstEventTypeValue, idx: number): Promise<GstEvent | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_sticky_event`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('event_type', String(event_type));
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstEvent.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async get_stream(): Promise<GstStream | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_stream`, apiConfig.baseUrl);
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

      







 
  async get_stream_id(): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_stream_id`, apiConfig.baseUrl);
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

      







 
  async get_task_state(): Promise<GstTaskStateValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/get_task_state`, apiConfig.baseUrl);
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

      







 
  async has_current_caps(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/has_current_caps`, apiConfig.baseUrl);
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

      







 
  async is_active(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/is_active`, apiConfig.baseUrl);
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

      







 
  async is_blocked(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/is_blocked`, apiConfig.baseUrl);
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

      







 
  async is_blocking(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/is_blocking`, apiConfig.baseUrl);
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

      







 
  async is_linked(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/is_linked`, apiConfig.baseUrl);
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

      







 
  async iterate_internal_links(): Promise<GstIterator | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/iterate_internal_links`, apiConfig.baseUrl);
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
const instance = await GstIterator.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async iterate_internal_links_default(parent?: GstObject): Promise<GstIterator | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/iterate_internal_links_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
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
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GstIterator.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async link(sinkpad: GstPad): Promise<GstPadLinkReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/link`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sinkpad && typeof sinkpad === 'object' && 'ptr' in sinkpad) {
      url.searchParams.append('sinkpad', 'ptr,' + sinkpad.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async link_full(sinkpad: GstPad, flags: GstPadLinkCheckValue): Promise<GstPadLinkReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/link_full`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sinkpad && typeof sinkpad === 'object' && 'ptr' in sinkpad) {
      url.searchParams.append('sinkpad', 'ptr,' + sinkpad.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
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

      







 
  async link_maybe_ghosting(sink: GstPad): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/link_maybe_ghosting`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sink && typeof sink === 'object' && 'ptr' in sink) {
      url.searchParams.append('sink', 'ptr,' + sink.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async link_maybe_ghosting_full(sink: GstPad, flags: GstPadLinkCheckValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/link_maybe_ghosting_full`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sink && typeof sink === 'object' && 'ptr' in sink) {
      url.searchParams.append('sink', 'ptr,' + sink.ptr);
    }
    // Primitive parameter
    url.searchParams.append('flags', String(flags));
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

      







 
  async mark_reconfigure(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/mark_reconfigure`, apiConfig.baseUrl);
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

      







 
  async needs_reconfigure(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/needs_reconfigure`, apiConfig.baseUrl);
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

      







 
  async pause_task(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/pause_task`, apiConfig.baseUrl);
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

      







 
  async peer_query(query: GstQuery): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async peer_query_accept_caps(caps: GstCaps): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query_accept_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async peer_query_caps(filter?: GstCaps): Promise<GstCaps> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (filter !== undefined && typeof filter === 'object' && 'ptr' in filter) {
      url.searchParams.append('filter', 'ptr,' + filter.ptr);
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async peer_query_convert(src_format: GstFormatValue, src_val: number, dest_format: GstFormatValue): Promise<{dest_val: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query_convert`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('src_format', String(src_format));
    // Primitive parameter
    url.searchParams.append('src_val', String(src_val));
    // Primitive parameter
    url.searchParams.append('dest_format', String(dest_format));
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
      // Handle return parameter: dest_val
      result.dest_val = await (async () => {
        return data.dest_val;

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

      







 
  async peer_query_duration(format: GstFormatValue): Promise<{duration: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query_duration`, apiConfig.baseUrl);
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
      // Handle return parameter: duration
      result.duration = await (async () => {
        return data.duration;

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

      







 
  async peer_query_position(format: GstFormatValue): Promise<{cur: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/peer_query_position`, apiConfig.baseUrl);
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
      // Handle return parameter: cur
      result.cur = await (async () => {
        return data.cur;

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

      







 
  async proxy_query_accept_caps(query: GstQuery): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/proxy_query_accept_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async proxy_query_caps(query: GstQuery): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/proxy_query_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async pull_range(offset: number, size: number, buffer: GstBuffer): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/pull_range`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
    // Primitive parameter
    url.searchParams.append('size', String(size));
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async push(buffer: GstBuffer): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/push`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (buffer && typeof buffer === 'object' && 'ptr' in buffer) {
      url.searchParams.append('buffer', 'ptr,' + buffer.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async push_event(event: GstEvent): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/push_event`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (event && typeof event === 'object' && 'ptr' in event) {
      url.searchParams.append('event', 'ptr,' + event.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async push_list(list: GstBufferList): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/push_list`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (list && typeof list === 'object' && 'ptr' in list) {
      url.searchParams.append('list', 'ptr,' + list.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async query(query: GstQuery): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async query_accept_caps(caps: GstCaps): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_accept_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (caps && typeof caps === 'object' && 'ptr' in caps) {
      url.searchParams.append('caps', 'ptr,' + caps.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async query_caps(filter?: GstCaps): Promise<GstCaps> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_caps`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (filter !== undefined && typeof filter === 'object' && 'ptr' in filter) {
      url.searchParams.append('filter', 'ptr,' + filter.ptr);
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
const instance = await GstCaps.create(data.return.ptr, 'full');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async query_convert(src_format: GstFormatValue, src_val: number, dest_format: GstFormatValue): Promise<{dest_val: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_convert`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('src_format', String(src_format));
    // Primitive parameter
    url.searchParams.append('src_val', String(src_val));
    // Primitive parameter
    url.searchParams.append('dest_format', String(dest_format));
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
      // Handle return parameter: dest_val
      result.dest_val = await (async () => {
        return data.dest_val;

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

      







 
  async query_default(query: GstQuery, parent?: GstObject): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (parent !== undefined && typeof parent === 'object' && 'ptr' in parent) {
      url.searchParams.append('parent', 'ptr,' + parent.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async query_duration(format: GstFormatValue): Promise<{duration: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_duration`, apiConfig.baseUrl);
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
      // Handle return parameter: duration
      result.duration = await (async () => {
        return data.duration;

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

      







 
  async query_position(format: GstFormatValue): Promise<{cur: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/query_position`, apiConfig.baseUrl);
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
      // Handle return parameter: cur
      result.cur = await (async () => {
        return data.cur;

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

      







 
  async remove_probe(id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/remove_probe`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('id', String(id));
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

      







 
  async send_event(event: GstEvent): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/send_event`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (event && typeof event === 'object' && 'ptr' in event) {
      url.searchParams.append('event', 'ptr,' + event.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async set_activate_function_full(session_id: string, callback_secret: string, activate: GstPadActivateFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_activate_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let activate_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof activate !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      activate_callbackInfo = callbackHandler.registerCallback(
        activate, 
        convertGstPadActivateFunctionArgs,
        {
          methodName: 'set_activate_function_full',
          paramName: 'activate'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('activate', activate_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_activatemode_function_full(session_id: string, callback_secret: string, activatemode: GstPadActivateModeFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_activatemode_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let activatemode_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof activatemode !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      activatemode_callbackInfo = callbackHandler.registerCallback(
        activatemode, 
        convertGstPadActivateModeFunctionArgs,
        {
          methodName: 'set_activatemode_function_full',
          paramName: 'activatemode'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('activatemode', activatemode_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_active(active: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_active`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('active', String(active));
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

      







 
  async set_chain_function_full(session_id: string, callback_secret: string, chain: GstPadChainFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_chain_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let chain_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof chain !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      chain_callbackInfo = callbackHandler.registerCallback(
        chain, 
        convertGstPadChainFunctionArgs,
        {
          methodName: 'set_chain_function_full',
          paramName: 'chain'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('chain', chain_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_chain_list_function_full(session_id: string, callback_secret: string, chainlist: GstPadChainListFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_chain_list_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let chainlist_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof chainlist !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      chainlist_callbackInfo = callbackHandler.registerCallback(
        chainlist, 
        convertGstPadChainListFunctionArgs,
        {
          methodName: 'set_chain_list_function_full',
          paramName: 'chainlist'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('chainlist', chainlist_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_element_private(priv?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_element_private`, apiConfig.baseUrl);
    // Primitive parameter
    if (priv !== undefined) url.searchParams.append('priv', String(priv));
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

      







 
  async set_event_full_function_full(session_id: string, callback_secret: string, event: GstPadEventFullFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_event_full_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let event_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof event !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      event_callbackInfo = callbackHandler.registerCallback(
        event, 
        convertGstPadEventFullFunctionArgs,
        {
          methodName: 'set_event_full_function_full',
          paramName: 'event'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('event', event_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_event_function_full(session_id: string, callback_secret: string, event: GstPadEventFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_event_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let event_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof event !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      event_callbackInfo = callbackHandler.registerCallback(
        event, 
        convertGstPadEventFunctionArgs,
        {
          methodName: 'set_event_function_full',
          paramName: 'event'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('event', event_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_getrange_function_full(session_id: string, callback_secret: string, get: GstPadGetRangeFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_getrange_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let get_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof get !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      get_callbackInfo = callbackHandler.registerCallback(
        get, 
        convertGstPadGetRangeFunctionArgs,
        {
          methodName: 'set_getrange_function_full',
          paramName: 'get'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('get', get_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_iterate_internal_links_function_full(session_id: string, callback_secret: string, iterintlink: GstPadIterIntLinkFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_iterate_internal_links_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let iterintlink_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof iterintlink !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      iterintlink_callbackInfo = callbackHandler.registerCallback(
        iterintlink, 
        convertGstPadIterIntLinkFunctionArgs,
        {
          methodName: 'set_iterate_internal_links_function_full',
          paramName: 'iterintlink'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('iterintlink', iterintlink_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_link_function_full(session_id: string, callback_secret: string, link: GstPadLinkFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_link_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let link_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof link !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      link_callbackInfo = callbackHandler.registerCallback(
        link, 
        convertGstPadLinkFunctionArgs,
        {
          methodName: 'set_link_function_full',
          paramName: 'link'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('link', link_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_offset(offset: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_offset`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('offset', String(offset));
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

      







 
  async set_query_function_full(session_id: string, callback_secret: string, query: GstPadQueryFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_query_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let query_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof query !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      query_callbackInfo = callbackHandler.registerCallback(
        query, 
        convertGstPadQueryFunctionArgs,
        {
          methodName: 'set_query_function_full',
          paramName: 'query'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('query', query_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async set_unlink_function_full(session_id: string, callback_secret: string, unlink: GstPadUnlinkFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/set_unlink_function_full`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let unlink_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof unlink !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      unlink_callbackInfo = callbackHandler.registerCallback(
        unlink, 
        convertGstPadUnlinkFunctionArgs,
        {
          methodName: 'set_unlink_function_full',
          paramName: 'unlink'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('unlink', unlink_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async start_task(session_id: string, callback_secret: string, func: GstTaskFunction): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/start_task`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      func_callbackInfo = callbackHandler.registerCallback(
        func, 
        convertGstTaskFunctionArgs,
        {
          methodName: 'start_task',
          paramName: 'func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('func', func_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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
      const data = await response.json();
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async sticky_events_foreach(session_id: string, callback_secret: string, foreach_func: GstPadStickyEventsForeachFunction, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/sticky_events_foreach`, apiConfig.baseUrl);
    // Register callback using the callback handler
    let foreach_func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof foreach_func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      foreach_func_callbackInfo = callbackHandler.registerCallback(
        foreach_func, 
        convertGstPadStickyEventsForeachFunctionArgs,
        {
          methodName: 'sticky_events_foreach',
          paramName: 'foreach_func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('foreach_func', foreach_func_callbackInfo.callbackUrl);
    }
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {};
      if (Prefer) {
        headers['Prefer'] = Prefer;
      }
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
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

      







 
  async stop_task(): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/stop_task`, apiConfig.baseUrl);
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

      







 
  async store_sticky_event(event: GstEvent): Promise<GstFlowReturnValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/store_sticky_event`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (event && typeof event === 'object' && 'ptr' in event) {
      url.searchParams.append('event', 'ptr,' + event.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async unlink(sinkpad: GstPad): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/unlink`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (sinkpad && typeof sinkpad === 'object' && 'ptr' in sinkpad) {
      url.searchParams.append('sinkpad', 'ptr,' + sinkpad.ptr);
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  async use_fixed_caps(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/use_fixed_caps`, apiConfig.baseUrl);
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

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/get_type`, apiConfig.baseUrl);
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

      





  async connect_linked(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstPadLinkedHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/signals/linked/connect`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }

      // Build request body
      const body: Record<string, any> = {};
      if (typeof flags !== 'undefined') {
        body['flags'] = flags;
      }
      // Register callback using the callback handler
      if (typeof handler !== 'undefined') {
        const callbackHandler = getCallbackHandler();
        if (!callbackHandler) {
          throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
        }
        
        // Register the callback with its converter function
        const handler_callbackInfo = callbackHandler.registerCallback(
          handler, 
          convertGstPadLinkedHandlerArgs,
          {
            methodName: 'connect_linked',
            paramName: 'handler'
          }
        );
        
        // Pass the callback URL to the server in the request body
        body['handler'] = handler_callbackInfo.callbackUrl;
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
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
      





  async connect_unlinked(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstPadUnlinkedHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Pad/ptr,${this.ptr}/signals/unlinked/connect`, apiConfig.baseUrl);
    try {
      // Add headers for callback authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session_id) {
        headers['session-id'] = session_id;
      }
      if (callback_secret) {
        headers['callback-secret'] = callback_secret;
      }

      // Build request body
      const body: Record<string, any> = {};
      if (typeof flags !== 'undefined') {
        body['flags'] = flags;
      }
      // Register callback using the callback handler
      if (typeof handler !== 'undefined') {
        const callbackHandler = getCallbackHandler();
        if (!callbackHandler) {
          throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
        }
        
        // Register the callback with its converter function
        const handler_callbackInfo = callbackHandler.registerCallback(
          handler, 
          convertGstPadUnlinkedHandlerArgs,
          {
            methodName: 'connect_unlinked',
            paramName: 'handler'
          }
        );
        
        // Pass the callback URL to the server in the request body
        body['handler'] = handler_callbackInfo.callbackUrl;
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
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

