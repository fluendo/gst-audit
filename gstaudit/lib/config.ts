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

let config: GstAuditConfig = {
  host: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  port: parseInt(process.env.NEXT_PUBLIC_API_PORT || '9000'),
  basePath: process.env.NEXT_PUBLIC_API_BASE_PATH || '',
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
  // Normalize basePath to ensure it starts with / if non-empty
  if (config.basePath && !config.basePath.startsWith('/')) {
    config.basePath = `/${config.basePath}`;
  }
  config.baseUrl = `http://${config.host}:${config.port}${config.basePath}`;
}

export default config;
