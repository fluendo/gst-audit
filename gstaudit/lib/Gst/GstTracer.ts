
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GstObject } from './GstObject';
import { GstPlugin } from './GstPlugin';




export class GstTracer extends GstObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstTracer> {
    const instance = new GstTracer(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }



      







 
  static async register(name: string, type_: string, plugin?: GstPlugin): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Tracer/register`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (plugin !== undefined && typeof plugin === 'object' && 'ptr' in plugin) {
      url.searchParams.append('plugin', 'ptr,' + plugin.ptr);
    }
    // Primitive parameter
    url.searchParams.append('name', String(name));
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
    return data.return;


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/Gst/Tracer/get_type`, apiConfig.baseUrl);
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

