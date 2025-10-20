/**
 * Configuration for GstAudit application
 * Manages API host and port settings
 */

export interface GstAuditConfig {
  host: string;
  port: number;
  baseUrl: string;
}

let config: GstAuditConfig = {
  host: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  port: parseInt(process.env.NEXT_PUBLIC_API_PORT || '9000'),
  baseUrl: '',
};

// Initialize baseUrl
config.baseUrl = `http://${config.host}:${config.port}`;

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
  config.baseUrl = `http://${config.host}:${config.port}`;
}

export default config;
