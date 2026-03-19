export namespace GstVideoVideoColorMatrix {
  export const UNKNOWN: 'unknown' = 'unknown';
  export const RGB: 'rgb' = 'rgb';
  export const FCC: 'fcc' = 'fcc';
  export const BT709: 'bt709' = 'bt709';
  export const BT601: 'bt601' = 'bt601';
  export const SMPTE240M: 'smpte240m' = 'smpte240m';
  export const BT2020: 'bt2020' = 'bt2020';
    







 
  export async function from_iso(value_: number): Promise<GstVideoVideoColorMatrixValue> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorMatrix/from_iso`, apiConfig.baseUrl);
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

    







 
  export async function get_Kr_Kb(matrix: GstVideoVideoColorMatrixValue): Promise<{Kr: number, Kb: number, return: boolean}> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorMatrix/get_Kr_Kb`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('matrix', String(matrix));
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
      // Handle return parameter: Kr
      result.Kr = await (async () => {
        return data.Kr;

      })();
      // Handle return parameter: Kb
      result.Kb = await (async () => {
        return data.Kb;

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

    







 
  export async function to_iso(matrix: GstVideoVideoColorMatrixValue): Promise<number> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorMatrix/to_iso`, apiConfig.baseUrl);
    // Primitive parameter
    url.searchParams.append('matrix', String(matrix));
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

    







 
  export async function get_type(): Promise<string> {
    // Increment ref for parameters with full transfer ownership
    const url = new URL(`${apiConfig.normalizedBasePath}/GstVideo/VideoColorMatrix/get_type`, apiConfig.baseUrl);
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
  export type GstVideoVideoColorMatrixValue = "unknown" | "rgb" | "fcc" | "bt709" | "bt601" | "smpte240m" | "bt2020";
