
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import type { GLibErrorClearFunc } from './GLibErrorClearFunc';
import { convertGLibErrorClearFuncArgs } from './GLibErrorClearFunc';
import type { GLibErrorCopyFunc } from './GLibErrorCopyFunc';
import { convertGLibErrorCopyFuncArgs } from './GLibErrorCopyFunc';
import type { GLibErrorInitFunc } from './GLibErrorInitFunc';
import { convertGLibErrorInitFuncArgs } from './GLibErrorInitFunc';



// Finalization registry for GLibError
const gliberrorRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GLib/Error/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GLibError:', ptr, err));
});

export class GLibError {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GLibError> {
    const instance = new GLibError(ptr, transferType);
    if (transferType === 'full')
      gliberrorRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new_literal(domain: number, code: number, message: string): Promise<Pointer> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/new_literal`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('domain', String(domain));
    // Primitive parameter
    url.searchParams.append('code', String(code));
    // Primitive parameter
    url.searchParams.append('message', String(message));
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


      







 
  async free(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  async copy(): Promise<Pointer> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/copy`, apiConfig.baseUrl);
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

    







 
  async matches(domain: number, code: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/matches`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('domain', String(domain));
    // Primitive parameter
    url.searchParams.append('code', String(code));
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

    







 
  static async domain_register(error_type_name: string, error_type_private_size: number, session_id: string, callback_secret: string, error_type_init: GLibErrorInitFunc, error_type_copy: GLibErrorCopyFunc, error_type_clear: GLibErrorClearFunc): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/domain_register`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('error_type_name', String(error_type_name));
    // Primitive parameter
    url.searchParams.append('error_type_private_size', String(error_type_private_size));
    // Register callback using the callback handler
    let error_type_init_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_init !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_init_callbackInfo = callbackHandler.registerCallback(
        error_type_init, 
        convertGLibErrorInitFuncArgs,
        {
          methodName: 'domain_register',
          paramName: 'error_type_init'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_init', error_type_init_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let error_type_copy_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_copy !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_copy_callbackInfo = callbackHandler.registerCallback(
        error_type_copy, 
        convertGLibErrorCopyFuncArgs,
        {
          methodName: 'domain_register',
          paramName: 'error_type_copy'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_copy', error_type_copy_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let error_type_clear_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_clear !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_clear_callbackInfo = callbackHandler.registerCallback(
        error_type_clear, 
        convertGLibErrorClearFuncArgs,
        {
          methodName: 'domain_register',
          paramName: 'error_type_clear'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_clear', error_type_clear_callbackInfo.callbackUrl);
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

    







 
  static async domain_register_static(error_type_name: string, error_type_private_size: number, session_id: string, callback_secret: string, error_type_init: GLibErrorInitFunc, error_type_copy: GLibErrorCopyFunc, error_type_clear: GLibErrorClearFunc): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/domain_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('error_type_name', String(error_type_name));
    // Primitive parameter
    url.searchParams.append('error_type_private_size', String(error_type_private_size));
    // Register callback using the callback handler
    let error_type_init_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_init !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_init_callbackInfo = callbackHandler.registerCallback(
        error_type_init, 
        convertGLibErrorInitFuncArgs,
        {
          methodName: 'domain_register_static',
          paramName: 'error_type_init'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_init', error_type_init_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let error_type_copy_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_copy !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_copy_callbackInfo = callbackHandler.registerCallback(
        error_type_copy, 
        convertGLibErrorCopyFuncArgs,
        {
          methodName: 'domain_register_static',
          paramName: 'error_type_copy'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_copy', error_type_copy_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let error_type_clear_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof error_type_clear !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      error_type_clear_callbackInfo = callbackHandler.registerCallback(
        error_type_clear, 
        convertGLibErrorClearFuncArgs,
        {
          methodName: 'domain_register_static',
          paramName: 'error_type_clear'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('error_type_clear', error_type_clear_callbackInfo.callbackUrl);
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

    







 
  async get_domain(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/fields/domain`, apiConfig.baseUrl);
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

    







 
  async get_code(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/fields/code`, apiConfig.baseUrl);
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

    







 
  async get_message(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/ptr,${this.ptr}/fields/message`, apiConfig.baseUrl);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/Error/get_type`, apiConfig.baseUrl);
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

