
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GObjectConnectFlags } from '../GObject/GObjectConnectFlags';
import { GObjectObject } from '../GObject/GObjectObject';
import type { GstVideoColorBalanceChannelValueChangedHandler } from './GstVideoColorBalanceChannelValueChangedHandler';
import { convertGstVideoColorBalanceChannelValueChangedHandlerArgs } from './GstVideoColorBalanceChannelValueChangedHandler';




export class GstVideoColorBalanceChannel extends GObjectObject {


  // Override parent's create() to return correct type
  static async create(ptr: string, transferType: transferType): Promise<GstVideoColorBalanceChannel> {
    const instance = new GstVideoColorBalanceChannel(ptr, transferType);
    if (transferType === 'none') {
      await instance.ref();
    }
    return instance;
  }



      







 
  static async get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/ColorBalanceChannel/get_type`, apiConfig.baseUrl);
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

      





  async connect_value_changed(session_id: string, callback_secret: string, flags: GObjectConnectFlags, handler: GstVideoColorBalanceChannelValueChangedHandler): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/ColorBalanceChannel/ptr,${this.ptr}/signals/value-changed/connect`, apiConfig.baseUrl);
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
          convertGstVideoColorBalanceChannelValueChangedHandlerArgs,
          {
            methodName: 'connect_value_changed',
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

