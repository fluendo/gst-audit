/**
 * Types for buffer viewer components
 */

import { GstSample, GstBuffer, GstCaps } from '@/lib/gst';

/**
 * Represents a captured GstSample with its metadata
 */
export interface SampleData {
  sample: GstSample;
  buffer: GstBuffer | null;
  caps: GstCaps | null;
  mediaType: string | null;
  timestamp: string | null;
  duration: string | null;
  bufferSize: number | null;
}

/**
 * Video format information extracted from caps
 */
export interface VideoFormatInfo {
  format: string; // e.g., "I420", "RGBA", "NV12"
  width: number;
  height: number;
  framerate?: string; // e.g., "30/1"
}

/**
 * Audio format information extracted from caps
 */
export interface AudioFormatInfo {
  format: string; // e.g., "S16LE", "F32LE"
  rate: number;
  channels: number;
  layout?: string;
}

/**
 * Media type categories
 */
export enum MediaTypeCategory {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  APPLICATION = 'application',
  UNKNOWN = 'unknown',
}

/**
 * Props for specific format viewers
 */
export interface VideoViewerProps {
  sampleData: SampleData;
  formatInfo: VideoFormatInfo;
}
