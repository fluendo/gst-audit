/**
 * Configuration for GstAudit application
 * Manages API host, port, and base path settings
 */

export interface GstAuditConfig {
  host: string;
  port: number;
  basePath: string;
  baseUrl: string;
}

/**
 * Normalize base path to ensure it starts with / if non-empty
 */
function normalizeBasePath(basePath: string): string {
  return basePath && !basePath.startsWith('/') ? `/${basePath}` : basePath;
}

let config: GstAuditConfig = {
  host: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  port: parseInt(process.env.NEXT_PUBLIC_API_PORT || '9000'),
  basePath: normalizeBasePath(process.env.NEXT_PUBLIC_API_BASE_PATH || ''),
  baseUrl: '',
};

// Initialize baseUrl
config.baseUrl = `http://${config.host}:${config.port}${config.basePath}`;

/**
 * Get the current configuration
 */
export function getConfig(): GstAuditConfig {
  return config;
}

/**
 * Update the configuration
 * @param newConfig Partial configuration to update
 */
export function updateConfig(newConfig: Partial<Omit<GstAuditConfig, 'baseUrl'>>): void {
  config = {
    ...config,
    ...newConfig,
  };
  // Normalize basePath if it was updated
  if (newConfig.basePath !== undefined) {
    config.basePath = normalizeBasePath(config.basePath);
  }
  config.baseUrl = `http://${config.host}:${config.port}${config.basePath}`;
}

export default config;
