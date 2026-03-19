
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibSource } from '../GLib/GLibSource';
import { GLibVariant } from '../GLib/GLibVariant';
import { GLibVariantType } from '../GLib/GLibVariantType';
import type { GObjectBoxedCopyFunc } from './GObjectBoxedCopyFunc';
import { convertGObjectBoxedCopyFuncArgs } from './GObjectBoxedCopyFunc';
import type { GObjectBoxedFreeFunc } from './GObjectBoxedFreeFunc';
import { convertGObjectBoxedFreeFuncArgs } from './GObjectBoxedFreeFunc';
import type { GObjectCallback } from './GObjectCallback';
import { convertGObjectCallbackArgs } from './GObjectCallback';
import { GObjectClosure } from './GObjectClosure';
import type { GObjectClosureMarshal } from './GObjectClosureMarshal';
import { convertGObjectClosureMarshalArgs } from './GObjectClosureMarshal';
import type { GObjectConnectFlags } from './GObjectConnectFlags';
import { GObjectEnumClass } from './GObjectEnumClass';
import { GObjectEnumValue } from './GObjectEnumValue';
import { GObjectFlagsClass } from './GObjectFlagsClass';
import { GObjectFlagsValue } from './GObjectFlagsValue';
import { GObjectInterfaceInfo } from './GObjectInterfaceInfo';
import { GObjectObject } from './GObjectObject';
import type { GObjectParamFlags } from './GObjectParamFlags';
import { GObjectParamSpec } from './GObjectParamSpec';
import { GObjectParamSpecTypeInfo } from './GObjectParamSpecTypeInfo';
import type { GObjectSignalAccumulator } from './GObjectSignalAccumulator';
import { convertGObjectSignalAccumulatorArgs } from './GObjectSignalAccumulator';
import type { GObjectSignalEmissionHook } from './GObjectSignalEmissionHook';
import { convertGObjectSignalEmissionHookArgs } from './GObjectSignalEmissionHook';
import type { GObjectSignalFlags } from './GObjectSignalFlags';
import { GObjectSignalInvocationHint } from './GObjectSignalInvocationHint';
import type { GObjectSignalMatchType } from './GObjectSignalMatchType';
import { GObjectSignalQuery } from './GObjectSignalQuery';
import { GObjectTypeClass } from './GObjectTypeClass';
import type { GObjectTypeDebugFlags } from './GObjectTypeDebugFlags';
import type { GObjectTypeFlags } from './GObjectTypeFlags';
import { GObjectTypeFundamentalInfo } from './GObjectTypeFundamentalInfo';
import { GObjectTypeInfo } from './GObjectTypeInfo';
import { GObjectTypeInstance } from './GObjectTypeInstance';
import { GObjectTypeInterface } from './GObjectTypeInterface';
import { GObjectTypeQuery } from './GObjectTypeQuery';
import { GObjectValue } from './GObjectValue';



export namespace GObject {
  







 
  export async function boxed_copy(boxed_type: string, src_boxed: Pointer): Promise<Pointer> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/boxed_copy`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('boxed_type', String(boxed_type));
    // Primitive parameter
    url.searchParams.append('src_boxed', String(src_boxed));
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

  







 
  export async function boxed_free(boxed_type: string, boxed: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/boxed_free`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('boxed_type', String(boxed_type));
    // Primitive parameter
    url.searchParams.append('boxed', String(boxed));
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

  







 
  export async function boxed_type_register_static(name: string, session_id: string, callback_secret: string, boxed_copy: GObjectBoxedCopyFunc, boxed_free: GObjectBoxedFreeFunc): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/boxed_type_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Register callback using the callback handler
    let boxed_copy_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof boxed_copy !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      boxed_copy_callbackInfo = callbackHandler.registerCallback(
        boxed_copy, 
        convertGObjectBoxedCopyFuncArgs,
        {
          methodName: 'boxed_type_register_static',
          paramName: 'boxed_copy'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('boxed_copy', boxed_copy_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let boxed_free_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof boxed_free !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      boxed_free_callbackInfo = callbackHandler.registerCallback(
        boxed_free, 
        convertGObjectBoxedFreeFuncArgs,
        {
          methodName: 'boxed_type_register_static',
          paramName: 'boxed_free'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('boxed_free', boxed_free_callbackInfo.callbackUrl);
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

  







 
  export async function cclosure_marshal_BOOLEAN__BOXED_BOXED(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_BOOLEAN__BOXED_BOXED`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_BOOLEAN__FLAGS(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_BOOLEAN__FLAGS`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_STRING__OBJECT_POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_STRING__OBJECT_POINTER`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__BOOLEAN(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__BOOLEAN`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__BOXED(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__BOXED`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__CHAR(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__CHAR`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__DOUBLE(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__DOUBLE`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__ENUM(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__ENUM`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__FLAGS(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__FLAGS`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__FLOAT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__FLOAT`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__INT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__INT`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__LONG(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__LONG`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__OBJECT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__OBJECT`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__PARAM(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__PARAM`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__POINTER`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__STRING(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__STRING`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__UCHAR(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__UCHAR`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__UINT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__UINT`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__UINT_POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__UINT_POINTER`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__ULONG(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__ULONG`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__VARIANT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__VARIANT`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_VOID__VOID(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_VOID__VOID`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function cclosure_marshal_generic(closure: GObjectClosure, return_gvalue: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/cclosure_marshal_generic`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_gvalue && typeof return_gvalue === 'object' && 'ptr' in return_gvalue) {
      url.searchParams.append('return_gvalue', 'ptr,' + return_gvalue.ptr);
    }
    // Primitive parameter
    url.searchParams.append('n_param_values', String(n_param_values));
    // Object with explode=false: serialize as comma-separated
    if (param_values && typeof param_values === 'object' && 'ptr' in param_values) {
      url.searchParams.append('param_values', 'ptr,' + param_values.ptr);
    }
    // Primitive parameter
    if (invocation_hint !== undefined) url.searchParams.append('invocation_hint', String(invocation_hint));
    // Primitive parameter
    if (marshal_data !== undefined) url.searchParams.append('marshal_data', String(marshal_data));
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

  







 
  export async function clear_signal_handler(handler_id_ptr: number, instance: GObjectObject, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/clear_signal_handler`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('handler_id_ptr', String(handler_id_ptr));
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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

  







 
  export async function enum_complete_type_info(g_enum_type: string, info: GObjectTypeInfo, const_values: GObjectEnumValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_complete_type_info`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('g_enum_type', String(g_enum_type));
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (const_values && typeof const_values === 'object' && 'ptr' in const_values) {
      url.searchParams.append('const_values', 'ptr,' + const_values.ptr);
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

  







 
  export async function enum_get_value(enum_class: GObjectEnumClass, value_: number): Promise<GObjectEnumValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_get_value`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (enum_class && typeof enum_class === 'object' && 'ptr' in enum_class) {
      url.searchParams.append('enum_class', 'ptr,' + enum_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('value', String(value_));
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
const instance = await GObjectEnumValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function enum_get_value_by_name(enum_class: GObjectEnumClass, name: string): Promise<GObjectEnumValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_get_value_by_name`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (enum_class && typeof enum_class === 'object' && 'ptr' in enum_class) {
      url.searchParams.append('enum_class', 'ptr,' + enum_class.ptr);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GObjectEnumValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function enum_get_value_by_nick(enum_class: GObjectEnumClass, nick: string): Promise<GObjectEnumValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_get_value_by_nick`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (enum_class && typeof enum_class === 'object' && 'ptr' in enum_class) {
      url.searchParams.append('enum_class', 'ptr,' + enum_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('nick', String(nick));
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
const instance = await GObjectEnumValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function enum_register_static(name: string, const_static_values: GObjectEnumValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Object with explode=false: serialize as comma-separated
    if (const_static_values && typeof const_static_values === 'object' && 'ptr' in const_static_values) {
      url.searchParams.append('const_static_values', 'ptr,' + const_static_values.ptr);
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

  







 
  export async function enum_to_string(g_enum_type: string, value_: number): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/enum_to_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('g_enum_type', String(g_enum_type));
    // Primitive parameter
    url.searchParams.append('value', String(value_));
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

  







 
  export async function flags_complete_type_info(g_flags_type: string, info: GObjectTypeInfo, const_values: GObjectFlagsValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_complete_type_info`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('g_flags_type', String(g_flags_type));
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (const_values && typeof const_values === 'object' && 'ptr' in const_values) {
      url.searchParams.append('const_values', 'ptr,' + const_values.ptr);
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

  







 
  export async function flags_get_first_value(flags_class: GObjectFlagsClass, value_: number): Promise<GObjectFlagsValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_get_first_value`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (flags_class && typeof flags_class === 'object' && 'ptr' in flags_class) {
      url.searchParams.append('flags_class', 'ptr,' + flags_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('value', String(value_));
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
const instance = await GObjectFlagsValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function flags_get_value_by_name(flags_class: GObjectFlagsClass, name: string): Promise<GObjectFlagsValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_get_value_by_name`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (flags_class && typeof flags_class === 'object' && 'ptr' in flags_class) {
      url.searchParams.append('flags_class', 'ptr,' + flags_class.ptr);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
const instance = await GObjectFlagsValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function flags_get_value_by_nick(flags_class: GObjectFlagsClass, nick: string): Promise<GObjectFlagsValue | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_get_value_by_nick`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (flags_class && typeof flags_class === 'object' && 'ptr' in flags_class) {
      url.searchParams.append('flags_class', 'ptr,' + flags_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('nick', String(nick));
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
const instance = await GObjectFlagsValue.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function flags_register_static(name: string, const_static_values: GObjectFlagsValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Object with explode=false: serialize as comma-separated
    if (const_static_values && typeof const_static_values === 'object' && 'ptr' in const_static_values) {
      url.searchParams.append('const_static_values', 'ptr,' + const_static_values.ptr);
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

  







 
  export async function flags_to_string(flags_type: string, value_: number): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/flags_to_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('flags_type', String(flags_type));
    // Primitive parameter
    url.searchParams.append('value', String(value_));
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

  







 
  export async function gtype_get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/gtype_get_type`, apiConfig.baseUrl);
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

  







 
  export async function param_spec_boolean(name: string, default_value: boolean, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_boolean`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_boxed(name: string, boxed_type: string, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_boxed`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('boxed_type', String(boxed_type));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_char(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_char`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_double(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_double`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_enum(name: string, enum_type: string, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_enum`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('enum_type', String(enum_type));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_flags(name: string, flags_type: string, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_flags`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('flags_type', String(flags_type));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_float(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_float`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_gtype(name: string, is_a_type: string, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_gtype`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('is_a_type', String(is_a_type));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_int(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_int`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_int64(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_int64`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_long(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_long`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_object(name: string, object_type: string, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_object`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('object_type', String(object_type));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_param(name: string, param_type: string, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_param`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('param_type', String(param_type));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_pointer(name: string, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_pointer`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_string(name: string, flags: GObjectParamFlags, nick?: string, blurb?: string, default_value?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_string`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    if (default_value !== undefined) url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_uchar(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_uchar`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_uint(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_uint`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_uint64(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_uint64`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_ulong(name: string, minimum: number, maximum: number, default_value: number, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_ulong`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('minimum', String(minimum));
    // Primitive parameter
    url.searchParams.append('maximum', String(maximum));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_unichar(name: string, default_value: Pointer, flags: GObjectParamFlags, nick?: string, blurb?: string): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_unichar`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Primitive parameter
    url.searchParams.append('default_value', String(default_value));
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_spec_variant(name: string, type_: GLibVariantType, flags: GObjectParamFlags, nick?: string, blurb?: string, default_value?: GLibVariant): Promise<GObjectParamSpec> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_spec_variant`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    if (nick !== undefined) url.searchParams.append('nick', String(nick));
    // Primitive parameter
    if (blurb !== undefined) url.searchParams.append('blurb', String(blurb));
    // Object with explode=false: serialize as comma-separated
    if (type_ && typeof type_ === 'object' && 'ptr' in type_) {
      url.searchParams.append('type', 'ptr,' + type_.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (default_value !== undefined && typeof default_value === 'object' && 'ptr' in default_value) {
      url.searchParams.append('default_value', 'ptr,' + default_value.ptr);
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
          // Return value is an object, instantiate it from the ptr
      if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
        // Use static factory method to properly await ref counting
const instance = await GObjectParamSpec.create(data.return.ptr, 'full');
        return instance;
      }
      return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function param_type_register_static(name: string, pspec_info: GObjectParamSpecTypeInfo): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_type_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Object with explode=false: serialize as comma-separated
    if (pspec_info && typeof pspec_info === 'object' && 'ptr' in pspec_info) {
      url.searchParams.append('pspec_info', 'ptr,' + pspec_info.ptr);
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

  







 
  export async function param_value_convert(pspec: GObjectParamSpec, src_value: GObjectValue, dest_value: GObjectValue, strict_validation: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_value_convert`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (src_value && typeof src_value === 'object' && 'ptr' in src_value) {
      url.searchParams.append('src_value', 'ptr,' + src_value.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (dest_value && typeof dest_value === 'object' && 'ptr' in dest_value) {
      url.searchParams.append('dest_value', 'ptr,' + dest_value.ptr);
    }
    // Primitive parameter
    url.searchParams.append('strict_validation', String(strict_validation));
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

  







 
  export async function param_value_defaults(pspec: GObjectParamSpec, value_: GObjectValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_value_defaults`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function param_value_is_valid(pspec: GObjectParamSpec, value_: GObjectValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_value_is_valid`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function param_value_set_default(pspec: GObjectParamSpec, value_: GObjectValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_value_set_default`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function param_value_validate(pspec: GObjectParamSpec, value_: GObjectValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_value_validate`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function param_values_cmp(pspec: GObjectParamSpec, value1: GObjectValue, value2: GObjectValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/param_values_cmp`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (pspec && typeof pspec === 'object' && 'ptr' in pspec) {
      url.searchParams.append('pspec', 'ptr,' + pspec.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value1 && typeof value1 === 'object' && 'ptr' in value1) {
      url.searchParams.append('value1', 'ptr,' + value1.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (value2 && typeof value2 === 'object' && 'ptr' in value2) {
      url.searchParams.append('value2', 'ptr,' + value2.ptr);
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

  







 
  export async function pointer_type_register_static(name: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/pointer_type_register_static`, apiConfig.baseUrl);
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

  







 
  export async function signal_accumulator_first_wins(ihint: GObjectSignalInvocationHint, return_accu: GObjectValue, handler_return: GObjectValue, dummy?: Pointer): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_accumulator_first_wins`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (ihint && typeof ihint === 'object' && 'ptr' in ihint) {
      url.searchParams.append('ihint', 'ptr,' + ihint.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_accu && typeof return_accu === 'object' && 'ptr' in return_accu) {
      url.searchParams.append('return_accu', 'ptr,' + return_accu.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (handler_return && typeof handler_return === 'object' && 'ptr' in handler_return) {
      url.searchParams.append('handler_return', 'ptr,' + handler_return.ptr);
    }
    // Primitive parameter
    if (dummy !== undefined) url.searchParams.append('dummy', String(dummy));
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

  







 
  export async function signal_accumulator_true_handled(ihint: GObjectSignalInvocationHint, return_accu: GObjectValue, handler_return: GObjectValue, dummy?: Pointer): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_accumulator_true_handled`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (ihint && typeof ihint === 'object' && 'ptr' in ihint) {
      url.searchParams.append('ihint', 'ptr,' + ihint.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (return_accu && typeof return_accu === 'object' && 'ptr' in return_accu) {
      url.searchParams.append('return_accu', 'ptr,' + return_accu.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (handler_return && typeof handler_return === 'object' && 'ptr' in handler_return) {
      url.searchParams.append('handler_return', 'ptr,' + handler_return.ptr);
    }
    // Primitive parameter
    if (dummy !== undefined) url.searchParams.append('dummy', String(dummy));
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

  







 
  export async function signal_add_emission_hook(signal_id: number, detail: number, session_id: string, callback_secret: string, hook_func: GObjectSignalEmissionHook): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_add_emission_hook`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Register callback using the callback handler
    let hook_func_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof hook_func !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      hook_func_callbackInfo = callbackHandler.registerCallback(
        hook_func, 
        convertGObjectSignalEmissionHookArgs,
        {
          methodName: 'signal_add_emission_hook',
          paramName: 'hook_func'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('hook_func', hook_func_callbackInfo.callbackUrl);
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

  







 
  export async function signal_chain_from_overridden(instance_and_params: Array<GObjectValue>, return_value: GObjectValue, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_chain_from_overridden`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('instance_and_params', String(instance_and_params));
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
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

  







 
  export async function signal_connect_closure(instance: GObjectObject, detailed_signal: string, closure: GObjectClosure, after: boolean): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_connect_closure`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('detailed_signal', String(detailed_signal));
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    url.searchParams.append('after', String(after));
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

  







 
  export async function signal_connect_closure_by_id(instance: GObjectObject, signal_id: number, detail: number, closure: GObjectClosure, after: boolean): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_connect_closure_by_id`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    url.searchParams.append('after', String(after));
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

  







 
  export async function signal_emitv(instance_and_params: Array<GObjectValue>, signal_id: number, detail: number, return_value: GObjectValue): Promise<GObjectValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_emitv`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('instance_and_params', String(instance_and_params));
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (return_value && typeof return_value === 'object' && 'ptr' in return_value) {
      url.searchParams.append('return_value', 'ptr,' + return_value.ptr);
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
if (data.return_value && typeof data.return_value === 'object' && 'ptr' in data.return_value) {
const instance = await GObjectValue.create(data.return_value.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function signal_get_invocation_hint(instance: GObjectObject): Promise<GObjectSignalInvocationHint | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_get_invocation_hint`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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
const instance = await GObjectSignalInvocationHint.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function signal_handler_block(instance: GObjectObject, handler_id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handler_block`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('handler_id', String(handler_id));
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

  







 
  export async function signal_handler_disconnect(instance: GObjectObject, handler_id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handler_disconnect`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('handler_id', String(handler_id));
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

  







 
  export async function signal_handler_find(instance: GObjectObject, mask: GObjectSignalMatchType, signal_id: number, detail: number, closure?: GObjectClosure, func?: Pointer, data_?: Pointer): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handler_find`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('mask', String(mask));
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (closure !== undefined && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    if (func !== undefined) url.searchParams.append('func', String(func));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

  







 
  export async function signal_handler_is_connected(instance: GObjectObject, handler_id: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handler_is_connected`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('handler_id', String(handler_id));
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

  







 
  export async function signal_handler_unblock(instance: GObjectObject, handler_id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handler_unblock`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('handler_id', String(handler_id));
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

  







 
  export async function signal_handlers_block_matched(instance: GObjectObject, mask: GObjectSignalMatchType, signal_id: number, detail: number, closure?: GObjectClosure, func?: Pointer, data_?: Pointer): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handlers_block_matched`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('mask', String(mask));
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (closure !== undefined && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    if (func !== undefined) url.searchParams.append('func', String(func));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

  







 
  export async function signal_handlers_destroy(instance: GObjectObject, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handlers_destroy`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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

  







 
  export async function signal_handlers_disconnect_matched(instance: GObjectObject, mask: GObjectSignalMatchType, signal_id: number, detail: number, closure?: GObjectClosure, func?: Pointer, data_?: Pointer): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handlers_disconnect_matched`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('mask', String(mask));
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (closure !== undefined && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    if (func !== undefined) url.searchParams.append('func', String(func));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

  







 
  export async function signal_handlers_unblock_matched(instance: GObjectObject, mask: GObjectSignalMatchType, signal_id: number, detail: number, closure?: GObjectClosure, func?: Pointer, data_?: Pointer): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_handlers_unblock_matched`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('mask', String(mask));
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Object with explode=false: serialize as comma-separated
    if (closure !== undefined && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
    }
    // Primitive parameter
    if (func !== undefined) url.searchParams.append('func', String(func));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

  







 
  export async function signal_has_handler_pending(instance: GObjectObject, signal_id: number, detail: number, may_be_blocked: boolean): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_has_handler_pending`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
    // Primitive parameter
    url.searchParams.append('may_be_blocked', String(may_be_blocked));
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

  







 
  export async function signal_is_valid_name(name: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_is_valid_name`, apiConfig.baseUrl);
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

  







 
  export async function signal_list_ids(itype: string): Promise<Array<number>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_list_ids`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('itype', String(itype));
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
    if (data.return && Array.isArray(data.return)) {
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function signal_lookup(name: string, itype: string): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_lookup`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('name', String(name));
    // Primitive parameter
    url.searchParams.append('itype', String(itype));
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

  







 
  export async function signal_name(signal_id: number): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
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

  







 
  export async function signal_newv(signal_name: string, itype: string, signal_flags: GObjectSignalFlags, return_type: string, session_id: string, callback_secret: string, accumulator: GObjectSignalAccumulator, c_marshaller: GObjectClosureMarshal, class_closure?: GObjectClosure, param_types?: Array<string>): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_newv`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_name', String(signal_name));
    // Primitive parameter
    url.searchParams.append('itype', String(itype));
    // Primitive parameter
    url.searchParams.append('signal_flags', String(signal_flags));
    // Object with explode=false: serialize as comma-separated
    if (class_closure !== undefined && typeof class_closure === 'object' && 'ptr' in class_closure) {
      url.searchParams.append('class_closure', 'ptr,' + class_closure.ptr);
    }
    // Primitive parameter
    url.searchParams.append('return_type', String(return_type));
    // Primitive parameter
    if (param_types !== undefined) url.searchParams.append('param_types', String(param_types));
    // Register callback using the callback handler
    let accumulator_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof accumulator !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      accumulator_callbackInfo = callbackHandler.registerCallback(
        accumulator, 
        convertGObjectSignalAccumulatorArgs,
        {
          methodName: 'signal_newv',
          paramName: 'accumulator'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('accumulator', accumulator_callbackInfo.callbackUrl);
    }
    // Register callback using the callback handler
    let c_marshaller_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof c_marshaller !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      c_marshaller_callbackInfo = callbackHandler.registerCallback(
        c_marshaller, 
        convertGObjectClosureMarshalArgs,
        {
          methodName: 'signal_newv',
          paramName: 'c_marshaller'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('c_marshaller', c_marshaller_callbackInfo.callbackUrl);
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

  







 
  export async function signal_override_class_closure(signal_id: number, instance_type: string, class_closure: GObjectClosure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_override_class_closure`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Object with explode=false: serialize as comma-separated
    if (class_closure && typeof class_closure === 'object' && 'ptr' in class_closure) {
      url.searchParams.append('class_closure', 'ptr,' + class_closure.ptr);
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

  







 
  export async function signal_override_class_handler(signal_name: string, instance_type: string, session_id: string, callback_secret: string, class_handler: GObjectCallback, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_override_class_handler`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_name', String(signal_name));
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Register callback using the callback handler
    let class_handler_callbackInfo: { callbackUrl: string; callbackId: string } | undefined;
    if (typeof class_handler !== 'undefined') {
      const callbackHandler = getCallbackHandler();
      if (!callbackHandler) {
        throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
      }
      
      // Register the callback with its converter function
      class_handler_callbackInfo = callbackHandler.registerCallback(
        class_handler, 
        convertGObjectCallbackArgs,
        {
          methodName: 'signal_override_class_handler',
          paramName: 'class_handler'
        }
      );
      
      // Pass the callback URL to the server
      url.searchParams.append('class_handler', class_handler_callbackInfo.callbackUrl);
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

  







 
  export async function signal_parse_name(detailed_signal: string, itype: string, force_detail_quark: boolean): Promise<{signal_id_p: number, detail_p: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_parse_name`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('detailed_signal', String(detailed_signal));
    // Primitive parameter
    url.searchParams.append('itype', String(itype));
    // Primitive parameter
    url.searchParams.append('force_detail_quark', String(force_detail_quark));
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
      // Handle return parameter: signal_id_p
      result.signal_id_p = await (async () => {
        return data.signal_id_p;

      })();
      // Handle return parameter: detail_p
      result.detail_p = await (async () => {
        return data.detail_p;

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

  







 
  export async function signal_query(signal_id: number, query: GObjectSignalQuery, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_query`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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

  







 
  export async function signal_remove_emission_hook(signal_id: number, hook_id: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_remove_emission_hook`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('hook_id', String(hook_id));
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

  







 
  export async function signal_set_va_marshaller(signal_id: number, instance_type: string, va_marshaller: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_set_va_marshaller`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Primitive parameter
    url.searchParams.append('va_marshaller', String(va_marshaller));
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

  







 
  export async function signal_stop_emission(instance: GObjectObject, signal_id: number, detail: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_stop_emission`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('signal_id', String(signal_id));
    // Primitive parameter
    url.searchParams.append('detail', String(detail));
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

  







 
  export async function signal_stop_emission_by_name(instance: GObjectObject, detailed_signal: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_stop_emission_by_name`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('detailed_signal', String(detailed_signal));
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

  







 
  export async function signal_type_cclosure_new(itype: string, struct_offset: number): Promise<GObjectClosure> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_type_cclosure_new`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('itype', String(itype));
    // Primitive parameter
    url.searchParams.append('struct_offset', String(struct_offset));
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
const instance = await GObjectClosure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function source_set_closure(source: GLibSource, closure: GObjectClosure, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/source_set_closure`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (source && typeof source === 'object' && 'ptr' in source) {
      url.searchParams.append('source', 'ptr,' + source.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (closure && typeof closure === 'object' && 'ptr' in closure) {
      url.searchParams.append('closure', 'ptr,' + closure.ptr);
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

  







 
  export async function source_set_dummy_callback(source: GLibSource, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/source_set_dummy_callback`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (source && typeof source === 'object' && 'ptr' in source) {
      url.searchParams.append('source', 'ptr,' + source.ptr);
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

  







 
  export async function strdup_value_contents(value_: GObjectValue): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/strdup_value_contents`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function type_add_class_private(class_type: string, private_size: number, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_add_class_private`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('class_type', String(class_type));
    // Primitive parameter
    url.searchParams.append('private_size', String(private_size));
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

  







 
  export async function type_add_instance_private(class_type: string, private_size: number): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_add_instance_private`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('class_type', String(class_type));
    // Primitive parameter
    url.searchParams.append('private_size', String(private_size));
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

  







 
  export async function type_add_interface_dynamic(instance_type: string, interface_type: string, plugin: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_add_interface_dynamic`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
    // Primitive parameter
    url.searchParams.append('plugin', String(plugin));
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

  







 
  export async function type_add_interface_static(instance_type: string, interface_type: string, info: GObjectInterfaceInfo, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_add_interface_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
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

  







 
  export async function type_check_class_is_a(g_class: GObjectTypeClass, is_a_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_class_is_a`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_class && typeof g_class === 'object' && 'ptr' in g_class) {
      url.searchParams.append('g_class', 'ptr,' + g_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('is_a_type', String(is_a_type));
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

  







 
  export async function type_check_instance(instance: GObjectTypeInstance): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_instance`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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

  







 
  export async function type_check_instance_is_a(instance: GObjectTypeInstance, iface_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_instance_is_a`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('iface_type', String(iface_type));
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

  







 
  export async function type_check_instance_is_fundamentally_a(instance: GObjectTypeInstance, fundamental_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_instance_is_fundamentally_a`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
    }
    // Primitive parameter
    url.searchParams.append('fundamental_type', String(fundamental_type));
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

  







 
  export async function type_check_is_value_type(type_: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_is_value_type`, apiConfig.baseUrl);
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

  







 
  export async function type_check_value(value_: GObjectValue): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_value`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
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

  







 
  export async function type_check_value_holds(value_: GObjectValue, type_: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_check_value_holds`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (value_ && typeof value_ === 'object' && 'ptr' in value_) {
      url.searchParams.append('value', 'ptr,' + value_.ptr);
    }
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

  







 
  export async function type_children(type_: string): Promise<Array<string>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_children`, apiConfig.baseUrl);
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
    if (data.return && Array.isArray(data.return)) {
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_class_adjust_private_offset(private_size_or_offset: number, g_class?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_class_adjust_private_offset`, apiConfig.baseUrl);
    // Primitive parameter
    if (g_class !== undefined) url.searchParams.append('g_class', String(g_class));
    // Primitive parameter
    url.searchParams.append('private_size_or_offset', String(private_size_or_offset));
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

  







 
  export async function type_class_peek(type_: string): Promise<GObjectTypeClass> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_class_peek`, apiConfig.baseUrl);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GObjectTypeClass.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_class_peek_static(type_: string): Promise<GObjectTypeClass> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_class_peek_static`, apiConfig.baseUrl);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GObjectTypeClass.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_class_ref(type_: string): Promise<GObjectTypeClass> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_class_ref`, apiConfig.baseUrl);
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
    // Return value is a struct, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
const instance = await GObjectTypeClass.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_default_interface_peek(g_type: string): Promise<GObjectTypeInterface> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_default_interface_peek`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('g_type', String(g_type));
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
const instance = await GObjectTypeInterface.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_default_interface_ref(g_type: string): Promise<GObjectTypeInterface> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_default_interface_ref`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('g_type', String(g_type));
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
const instance = await GObjectTypeInterface.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_default_interface_unref(g_iface: GObjectTypeInterface, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_default_interface_unref`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_iface && typeof g_iface === 'object' && 'ptr' in g_iface) {
      url.searchParams.append('g_iface', 'ptr,' + g_iface.ptr);
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

  







 
  export async function type_depth(type_: string): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_depth`, apiConfig.baseUrl);
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

  







 
  export async function type_ensure(type_: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_ensure`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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

  







 
  export async function type_free_instance(instance: GObjectTypeInstance, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_free_instance`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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

  







 
  export async function type_from_name(name: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_from_name`, apiConfig.baseUrl);
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

  







 
  export async function type_fundamental(type_id: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_fundamental`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type_id', String(type_id));
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

  







 
  export async function type_fundamental_next(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_fundamental_next`, apiConfig.baseUrl);
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

  







 
  export async function type_get_instance_count(type_: string): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_get_instance_count`, apiConfig.baseUrl);
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

  







 
  export async function type_get_plugin(type_: string): Promise<Pointer> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_get_plugin`, apiConfig.baseUrl);
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

  







 
  export async function type_get_qdata(type_: string, quark: number): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_get_qdata`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Primitive parameter
    url.searchParams.append('quark', String(quark));
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

  







 
  export async function type_get_type_registration_serial(): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_get_type_registration_serial`, apiConfig.baseUrl);
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

  







 
  export async function type_init(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_init`, apiConfig.baseUrl);
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

  







 
  export async function type_init_with_debug_flags(debug_flags: GObjectTypeDebugFlags, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_init_with_debug_flags`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('debug_flags', String(debug_flags));
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

  







 
  export async function type_interface_add_prerequisite(interface_type: string, prerequisite_type: string, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interface_add_prerequisite`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
    // Primitive parameter
    url.searchParams.append('prerequisite_type', String(prerequisite_type));
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

  







 
  export async function type_interface_get_plugin(instance_type: string, interface_type: string): Promise<Pointer> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interface_get_plugin`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('instance_type', String(instance_type));
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
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

  







 
  export async function type_interface_instantiatable_prerequisite(interface_type: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interface_instantiatable_prerequisite`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
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

  







 
  export async function type_interface_peek(instance_class: GObjectTypeClass, iface_type: string): Promise<GObjectTypeInterface> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interface_peek`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance_class && typeof instance_class === 'object' && 'ptr' in instance_class) {
      url.searchParams.append('instance_class', 'ptr,' + instance_class.ptr);
    }
    // Primitive parameter
    url.searchParams.append('iface_type', String(iface_type));
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
const instance = await GObjectTypeInterface.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_interface_prerequisites(interface_type: string): Promise<Array<string>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interface_prerequisites`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('interface_type', String(interface_type));
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
    if (data.return && Array.isArray(data.return)) {
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_interfaces(type_: string): Promise<Array<string>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_interfaces`, apiConfig.baseUrl);
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
    if (data.return && Array.isArray(data.return)) {
  // Array of basic types - return as-is
  return data.return;
}
return Promise.reject("Call failed");

    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

  







 
  export async function type_is_a(type_: string, is_a_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_is_a`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Primitive parameter
    url.searchParams.append('is_a_type', String(is_a_type));
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

  







 
  export async function type_name(type_: string): Promise<string | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_name`, apiConfig.baseUrl);
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

  







 
  export async function type_name_from_class(g_class: GObjectTypeClass): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_name_from_class`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (g_class && typeof g_class === 'object' && 'ptr' in g_class) {
      url.searchParams.append('g_class', 'ptr,' + g_class.ptr);
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

  







 
  export async function type_name_from_instance(instance: GObjectTypeInstance): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_name_from_instance`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (instance && typeof instance === 'object' && 'ptr' in instance) {
      url.searchParams.append('instance', 'ptr,' + instance.ptr);
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

  







 
  export async function type_next_base(leaf_type: string, root_type: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_next_base`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('leaf_type', String(leaf_type));
    // Primitive parameter
    url.searchParams.append('root_type', String(root_type));
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

  







 
  export async function type_parent(type_: string): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_parent`, apiConfig.baseUrl);
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

  







 
  export async function type_qname(type_: string): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_qname`, apiConfig.baseUrl);
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

  







 
  export async function type_query(type_: string, query: GObjectTypeQuery, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_query`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Object with explode=false: serialize as comma-separated
    if (query && typeof query === 'object' && 'ptr' in query) {
      url.searchParams.append('query', 'ptr,' + query.ptr);
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

  







 
  export async function type_register_dynamic(parent_type: string, type_name: string, plugin: Pointer, flags: GObjectTypeFlags): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_register_dynamic`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('parent_type', String(parent_type));
    // Primitive parameter
    url.searchParams.append('type_name', String(type_name));
    // Primitive parameter
    url.searchParams.append('plugin', String(plugin));
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

  







 
  export async function type_register_fundamental(type_id: string, type_name: string, info: GObjectTypeInfo, finfo: GObjectTypeFundamentalInfo, flags: GObjectTypeFlags): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_register_fundamental`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type_id', String(type_id));
    // Primitive parameter
    url.searchParams.append('type_name', String(type_name));
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
    }
    // Object with explode=false: serialize as comma-separated
    if (finfo && typeof finfo === 'object' && 'ptr' in finfo) {
      url.searchParams.append('finfo', 'ptr,' + finfo.ptr);
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

  







 
  export async function type_register_static(parent_type: string, type_name: string, info: GObjectTypeInfo, flags: GObjectTypeFlags): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_register_static`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('parent_type', String(parent_type));
    // Primitive parameter
    url.searchParams.append('type_name', String(type_name));
    // Object with explode=false: serialize as comma-separated
    if (info && typeof info === 'object' && 'ptr' in info) {
      url.searchParams.append('info', 'ptr,' + info.ptr);
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

  







 
  export async function type_set_qdata(type_: string, quark: number, data_?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_set_qdata`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
    // Primitive parameter
    url.searchParams.append('quark', String(quark));
    // Primitive parameter
    if (data_ !== undefined) url.searchParams.append('data_', String(data_));
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

  







 
  export async function type_test_flags(type_: string, flags: number): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/type_test_flags`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('type', String(type_));
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

  







 
  export async function value_type_compatible(src_type: string, dest_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/value_type_compatible`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('src_type', String(src_type));
    // Primitive parameter
    url.searchParams.append('dest_type', String(dest_type));
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

  







 
  export async function value_type_transformable(src_type: string, dest_type: string): Promise<boolean> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/value_type_transformable`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('src_type', String(src_type));
    // Primitive parameter
    url.searchParams.append('dest_type', String(dest_type));
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

  







 
  export async function variant_get_gtype(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/variant_get_gtype`, apiConfig.baseUrl);
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

  





  export async function signal_connect_data(session_id: string, callback_secret: string, instance: GObjectObject, detailed_signal: string, connect_flags: GObjectConnectFlags, c_handler: GObjectCallback): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/signal_connect_data`, apiConfig.baseUrl);
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
      if (typeof instance !== 'undefined') {
        body['instance'] = instance;
      }
      if (typeof detailed_signal !== 'undefined') {
        body['detailed_signal'] = detailed_signal;
      }
      if (typeof connect_flags !== 'undefined') {
        body['connect_flags'] = connect_flags;
      }
      // Register callback using the callback handler
      if (typeof c_handler !== 'undefined') {
        const callbackHandler = getCallbackHandler();
        if (!callbackHandler) {
          throw new Error('Callback handler not configured. Call setCallbackHandler() first.');
        }
        
        // Register the callback with its converter function
        const c_handler_callbackInfo = callbackHandler.registerCallback(
          c_handler, 
          convertGObjectCallbackArgs,
          {
            methodName: 'signal_connect_data',
            paramName: 'c_handler'
          }
        );
        
        // Pass the callback URL to the server in the request body
        body['c_handler'] = c_handler_callbackInfo.callbackUrl;
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

