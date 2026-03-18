export namespace GstVideoNavigationModifierType {
  export const NONE: 'none' = 'none';
  export const SHIFT_MASK: 'shift_mask' = 'shift_mask';
  export const LOCK_MASK: 'lock_mask' = 'lock_mask';
  export const CONTROL_MASK: 'control_mask' = 'control_mask';
  export const MOD1_MASK: 'mod1_mask' = 'mod1_mask';
  export const MOD2_MASK: 'mod2_mask' = 'mod2_mask';
  export const MOD3_MASK: 'mod3_mask' = 'mod3_mask';
  export const MOD4_MASK: 'mod4_mask' = 'mod4_mask';
  export const MOD5_MASK: 'mod5_mask' = 'mod5_mask';
  export const BUTTON1_MASK: 'button1_mask' = 'button1_mask';
  export const BUTTON2_MASK: 'button2_mask' = 'button2_mask';
  export const BUTTON3_MASK: 'button3_mask' = 'button3_mask';
  export const BUTTON4_MASK: 'button4_mask' = 'button4_mask';
  export const BUTTON5_MASK: 'button5_mask' = 'button5_mask';
  export const SUPER_MASK: 'super_mask' = 'super_mask';
  export const HYPER_MASK: 'hyper_mask' = 'hyper_mask';
  export const META_MASK: 'meta_mask' = 'meta_mask';
  export const MASK: 'mask' = 'mask';
  export const META_MASK: 'meta_mask' = 'meta_mask';
    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/NavigationModifierType/get_type`, apiConfig.baseUrl);
    try {
      // Auto-inject correlation ID if we're in a callback context
      const correlationId = getActiveCorrelationId();
      const headers: Record<string, string> = {};
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
  export type GstVideoNavigationModifierTypeValue = "none" | "shift_mask" | "lock_mask" | "control_mask" | "mod1_mask" | "mod2_mask" | "mod3_mask" | "mod4_mask" | "mod5_mask" | "button1_mask" | "button2_mask" | "button3_mask" | "button4_mask" | "button5_mask" | "super_mask" | "hyper_mask" | "meta_mask" | "mask" | "meta_mask";
