
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectClosure } from './GObjectClosure';
import { GObjectValue } from './GObjectValue';



// Finalization registry for GObjectCClosure
const gobjectcclosureRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GObject/CClosure/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GObjectCClosure:', ptr, err));
});

export class GObjectCClosure {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GObjectCClosure> {
    const instance = new GObjectCClosure(ptr, transferType);
    if (transferType === 'full')
      gobjectcclosureRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(): Promise<GObjectCClosure> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/new`, apiConfig.baseUrl);
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
const instance = await GObjectCClosure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


      







 
  async free(): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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
    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


    







 
  static async marshal_BOOLEAN__BOXED_BOXED(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_BOOLEAN__BOXED_BOXED`, apiConfig.baseUrl);
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

    







 
  static async marshal_BOOLEAN__FLAGS(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_BOOLEAN__FLAGS`, apiConfig.baseUrl);
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

    







 
  static async marshal_STRING__OBJECT_POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_STRING__OBJECT_POINTER`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__BOOLEAN(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__BOOLEAN`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__BOXED(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__BOXED`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__CHAR(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__CHAR`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__DOUBLE(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__DOUBLE`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__ENUM(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__ENUM`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__FLAGS(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__FLAGS`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__FLOAT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__FLOAT`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__INT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__INT`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__LONG(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__LONG`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__OBJECT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__OBJECT`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__PARAM(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__PARAM`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__POINTER`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__STRING(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__STRING`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__UCHAR(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__UCHAR`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__UINT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__UINT`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__UINT_POINTER(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__UINT_POINTER`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__ULONG(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__ULONG`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__VARIANT(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__VARIANT`, apiConfig.baseUrl);
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

    







 
  static async marshal_VOID__VOID(closure: GObjectClosure, return_value: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_VOID__VOID`, apiConfig.baseUrl);
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

    







 
  static async marshal_generic(closure: GObjectClosure, return_gvalue: GObjectValue, n_param_values: number, param_values: GObjectValue, invocation_hint?: Pointer, marshal_data?: Pointer, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/marshal_generic`, apiConfig.baseUrl);
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

    







 
  async get_closure(): Promise<GObjectClosure | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/ptr,${this.ptr}/fields/closure`, apiConfig.baseUrl);
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
const instance = await GObjectClosure.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







 
  async get_callback(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/CClosure/ptr,${this.ptr}/fields/callback`, apiConfig.baseUrl);
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

