
// Import shared utilities (avoiding circular dependency with gst.ts)
import type { Pointer } from '../_shared';
import { apiConfig, getActiveCorrelationId, getCallbackHandler, transferType } from '../_shared';

// Auto-generated imports
import { GObjectTypeClass } from './GObjectTypeClass';





// Finalization registry for GObjectTypeInstance
const gobjecttypeinstanceRegistry = new FinalizationRegistry((ptr: string) => {
  fetch(apiConfig.fullBaseUrl + '/GObject/TypeInstance/ptr,' + ptr + '/free')
    .catch(err => console.error('Failed to free GObjectTypeInstance:', ptr, err));
});

// Type interface for GObject constructors with static get_type method
interface GObjectConstructor<T extends GObjectTypeInstance> {
  create(ptr: string, transferType: transferType): Promise<T>;
	get_type(): Promise<string>;
}

export class GObjectTypeInstance {

  ptr!: string;

  protected constructor(ptr: string, transferType: transferType) {
    this.ptr = ptr;
    // Don't register in constructor - use static create() method instead
  }

  static async create(ptr: string, transferType: transferType): Promise<GObjectTypeInstance> {
    const instance = new GObjectTypeInstance(ptr, transferType);
    if (transferType === 'full')
      gobjecttypeinstanceRegistry.register(instance, ptr);
    return instance;
  }


	async castTo<T extends GObjectTypeInstance>(TargetClass: GObjectConstructor<T>): Promise<T> {
    return await TargetClass.create(this.ptr, 'none');
  }

	async isOf<T extends GObjectTypeInstance>(TargetClass: GObjectConstructor<T>): Promise<boolean> {
    const type = await TargetClass.get_type();
    // Use dynamic import to avoid circular dependency (GObject.ts imports GObjectTypeInstance)
    const GObjectModule = await import('./GObject');
    const is_type = await GObjectModule.GObject.type_check_instance_is_a(this, type);
    return is_type;
  }

    







 
  async get_private(private_type: string): Promise<Pointer | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/TypeInstance/ptr,${this.ptr}/get_private`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('private_type', String(private_type));
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
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

    







 
  async get_g_class(): Promise<GObjectTypeClass | null> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GObject/TypeInstance/ptr,${this.ptr}/fields/g_class`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
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
const instance = await GObjectTypeClass.create(data.return.ptr, 'none');
  return instance;
}
return Promise.reject("Call failed");


    } catch (error) {
      // If there's an error, unref the objects we ref'd
      throw error;
    }
  }


}

