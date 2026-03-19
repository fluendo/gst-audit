
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibTestCase } from './GLibTestCase';



// Finalization registry for GLibTestSuite
const glibtestsuiteRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GLib/TestSuite/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GLibTestSuite:', ptr, err));
});

export class GLibTestSuite {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GLibTestSuite> {
    const instance = new GLibTestSuite(ptr, transferType);
    if (transferType === 'full')
      glibtestsuiteRegistry.register(instance, ptr);
    return instance;
  }
    







 
  static async new(): Promise<GLibTestSuite> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/TestSuite/new`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
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
const instance = await GLibTestSuite.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


      







 
  async free(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/TestSuite/ptr,${this.ptr}/free`, apiConfig.baseUrl);
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


    







 
  async add(test_case: GLibTestCase, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/TestSuite/ptr,${this.ptr}/add`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (test_case && typeof test_case === 'object' && 'ptr' in test_case) {
      url.searchParams.append('test_case', 'ptr,' + test_case.ptr);
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

    







 
  async add_suite(nestedsuite: GLibTestSuite, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/TestSuite/ptr,${this.ptr}/add_suite`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (nestedsuite && typeof nestedsuite === 'object' && 'ptr' in nestedsuite) {
      url.searchParams.append('nestedsuite', 'ptr,' + nestedsuite.ptr);
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

}

