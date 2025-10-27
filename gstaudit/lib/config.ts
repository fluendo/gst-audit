/**
 * Configuration for GstAudit application
 * Manages API host, port settings
 */
import { setApiConfig } from '@/lib/gst'; 

export interface GstAuditConfig {
  host: string;
  port: number;
  gstauditBasePath: string;
  gstauditBaseUrl: string;
  girestBasePath: string;
  girestBaseUrl: string;
}

let config: GstAuditConfig = {
  host: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
  port: parseInt(process.env.NEXT_PUBLIC_API_PORT || '9000'),
  gstauditBasePath: '/gstaudit',
  girestBasePath: '/girest',
};

// Initialize the baseUrls
config.gstauditBaseUrl = `http://${config.host}:${config.port}${config.gstauditBasePath}`;
config.giresttBaseUrl = `http://${config.host}:${config.port}${config.girestBasePath}`;
setApiConfig({host: config.host, port: config.port, basePath: config.girestBasePath});

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
export function updateConfig(newConfig: Partial<Omit<GstAuditConfig, 'gstauditBasePath' | 'gstauditBaseUrl' | 'girestBasePath' | 'girestBaseUrl'>>): void {
  config = {
    ...config,
    ...newConfig,
  };
  
  config.gstauditBaseUrl = `http://${config.host}:${config.port}${config.gstauditBasePath}`;
  config.girestBaseUrl = `http://${config.host}:${config.port}${config.girestBasePath}`;
  setApiConfig({host: config.host, port: config.port, basePath: config.girestBasePath});
}

export default config;
