
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GLibAllocator } from './GLibAllocator';



// Finalization registry for GLibList
const gliblistRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GLib/List/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GLibList:', ptr, err));
});

export class GLibList<T = any> implements AsyncIterable<T> {

	ptr!: string;
	head?: GLibList<T>;
  transferType!: transferType;
  TargetClass!: { create(ptr: string, transferType: transferType): Promise<T> };

	protected constructor(ptr: string, transferType: transferType, TargetClass: { create(ptr: string, transferType: transferType): Promise<T> }, head?: GLibList<T>) {
    if (ptr) {
      this.ptr = ptr;
      this.transferType = transferType;
			this.TargetClass = TargetClass;
			this.head = head;
      if (transferType !== 'none' && head === undefined)
			  gliblistRegistry.register(this, ptr);
    }
  }

  static async create<T>(ptr: string, transferType: transferType, TargetClass: { create(ptr: string, transferType: transferType): Promise<T> }, head?: GLibList<T>): Promise<GLibList<T>> {
    const instance = new GLibList(ptr, transferType, TargetClass, head);
    return instance;
  }
    







	static async new<T>(TargetClass: { create(ptr: string, transferType: transferType): Promise<T> }): Promise<GLibList<T>> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/new`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a List, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  const instance = await GLibList.create(data.return.ptr, 'none', TargetClass, undefined);
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
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/ptr,${this.ptr}/free`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
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


  // Implement AsyncIterable interface
  [Symbol.asyncIterator](): AsyncIterator<T, any, any> {
    let currentNode: GLibList | null = this;
    
    return {
      next: async (): Promise<IteratorResult<T>> => {
        // Check if current node is null/undefined (reached end of list)
        if (!currentNode || !currentNode.ptr) {
          return { done: true, value: undefined };
        }
        
        try {
          // Get the data from the current node
          const data = await currentNode.get_data();
          
          // Move to the next node
          const nextNode = await currentNode.get_next();
          
          // Check if nextNode has a valid pointer, if not we've reached the end
          if (nextNode && typeof nextNode === 'object' && 'ptr' in nextNode && nextNode.ptr) {
            currentNode = nextNode;
          } else {
            currentNode = null;
          }
          
          // Create an instance of the target class if TargetClass is provided and data is a pointer
          if (this.TargetClass && data && typeof data === 'string') {
            const instance = await this.TargetClass.create(data, this.transferType === 'full' ? 'full' : 'none');
            return { done: false, value: instance };
          }
          
          // Otherwise return the raw data cast to type T
          return { done: false, value: data as T };
        } catch (error) {
          // If we get an error, we're probably at the end of the list
          return { done: true, value: undefined };
        }
      }
    };
  }

    







 
  static async pop_allocator(Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/pop_allocator`, apiConfig.baseUrl);
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

    







 
  static async push_allocator(allocator: GLibAllocator, Prefer?: string): Promise<void> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/push_allocator`, apiConfig.baseUrl);
    // Object with explode=false: serialize as comma-separated
    if (allocator && typeof allocator === 'object' && 'ptr' in allocator) {
      url.searchParams.append('allocator', 'ptr,' + allocator.ptr);
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

    







 
  async get_data(): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/ptr,${this.ptr}/fields/data`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
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

    







  async get_next(): Promise<GLibList<T> | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/ptr,${this.ptr}/fields/next`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a List, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
  const instance = await GLibList.create(data.return.ptr, 'none', this.TargetClass, this.head);
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }

    







  async get_prev(): Promise<GLibList<T> | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GLib/List/ptr,${this.ptr}/fields/prev`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
      if (correlationId) {
        headers['X-Correlation-Id'] = correlationId;
      }
      const response = await fetch(url.toString(), Object.keys(headers).length > 0 ? { headers } : undefined);
      if (!response.ok) {
        // If the call fails, unref the objects we ref'd
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
    // Return value is a List, instantiate it from the ptr
if (data.return && typeof data.return === 'object' && 'ptr' in data.return) {
  if (data.return.ptr === null) {
    return null;
  }
  const instance = await GLibList.create(data.return.ptr, 'none', this.TargetClass, this.head);
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


}

