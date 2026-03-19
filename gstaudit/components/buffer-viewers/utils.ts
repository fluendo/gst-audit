/**
 * Utility functions for buffer viewers
 */

import { GstSample, GstCaps, GstStructure } from '@/lib/gst';
import { SampleData, MediaTypeCategory, VideoFormatInfo, AudioFormatInfo } from './types';

/**
 * Extract complete sample data from a GstSample
 */
export async function extractSampleData(sample: GstSample): Promise<SampleData> {
  try {
    const buffer = await sample.get_buffer();
    const caps = await sample.get_caps();
    
    let mediaType: string | null = null;
    if (caps) {
      const numStructures = await caps.get_size();
      if (numStructures > 0) {
        const structure = await caps.get_structure(0);
        mediaType = await structure.get_name();
      }
    }

    // Get timestamp and duration from buffer if available
    let timestamp: string | null = null;
    let duration: string | null = null;
    let bufferSize: number | null = null;

    if (buffer) {
      try {
        // Get PTS (presentation timestamp)
        const pts = await buffer.get_pts();
        timestamp = formatTimestamp(pts);
      } catch (e) {
        console.warn('Failed to get buffer PTS:', e);
      }

      try {
        const dur = await buffer.get_duration();
        duration = formatTimestamp(dur);
      } catch (e) {
        console.warn('Failed to get buffer duration:', e);
      }

      try {
        bufferSize = await buffer.get_size();
      } catch (e) {
        console.warn('Failed to get buffer size:', e);
      }
    }

    return {
      sample,
      buffer,
      caps,
      mediaType,
      timestamp,
      duration,
      bufferSize,
    };
  } catch (error) {
    console.error('Error extracting sample data:', error);
    throw error;
  }
}

/**
 * Format a GStreamer timestamp (in nanoseconds) to human-readable string
 */
export function formatTimestamp(ns: number | bigint): string {
  if (ns === undefined || ns === null) return 'none';
  
  const GST_CLOCK_TIME_NONE = BigInt('18446744073709551615'); // UINT64_MAX
  const nsValue = BigInt(ns);
  
  if (nsValue === GST_CLOCK_TIME_NONE) {
    return 'none';
  }

  const seconds = Number(nsValue / BigInt(1000000000));
  const nanoseconds = Number(nsValue % BigInt(1000000000));
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const ms = Math.floor(nanoseconds / 1000000);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
}

/**
 * Format buffer size to human-readable string
 */
export function formatBufferSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return 'unknown';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get media type category from caps media type string
 */
export function getMediaTypeCategory(mediaType: string | null): MediaTypeCategory {
  if (!mediaType) return MediaTypeCategory.UNKNOWN;
  
  if (mediaType.startsWith('video/')) return MediaTypeCategory.VIDEO;
  if (mediaType.startsWith('audio/')) return MediaTypeCategory.AUDIO;
  if (mediaType.startsWith('text/')) return MediaTypeCategory.TEXT;
  if (mediaType.startsWith('application/')) return MediaTypeCategory.APPLICATION;
  
  return MediaTypeCategory.UNKNOWN;
}

/**
 * Parse video format information from caps structure
 */
export async function parseVideoFormat(structure: GstStructure): Promise<VideoFormatInfo | null> {
  try {
    // Get format
    let format = 'unknown';
    try {
      const formatStr = await structure.get_string('format');
      if (formatStr) {
        format = formatStr;
      }
    } catch (e) {
      console.warn('No format field in video caps');
    }

    // Get dimensions
    let width = 0;
    let height = 0;
    try {
      const widthResult = await structure.get_int('width');
      const heightResult = await structure.get_int('height');
      if (widthResult.return) {
        width = widthResult.value;
      }
      if (heightResult.return) {
        height = heightResult.value;
      }
    } catch (e) {
      console.warn('Failed to get video dimensions:', e);
    }

    // Get framerate (optional)
    let framerate: string | undefined;
    try {
      const fractionValue = await structure.get_value('framerate');
      // fractionValue might be a GValue containing a fraction
      // For now, we'll get it as a string representation
      framerate = String(fractionValue);
    } catch (e) {
      // Framerate is optional
    }

    return {
      format,
      width,
      height,
      framerate,
    };
  } catch (error) {
    console.error('Error parsing video format:', error);
    return null;
  }
}

/**
 * Parse audio format information from caps structure
 */
export async function parseAudioFormat(structure: GstStructure): Promise<AudioFormatInfo | null> {
  try {
    // Get format
    let format = 'unknown';
    try {
      const formatStr = await structure.get_string('format');
      if (formatStr) {
        format = formatStr;
      }
    } catch (e) {
      console.warn('No format field in audio caps');
    }

    // Get sample rate
    let rate = 0;
    try {
      const rateResult = await structure.get_int('rate');
      if (rateResult.return) {
        rate = rateResult.value;
      }
    } catch (e) {
      console.warn('Failed to get audio rate:', e);
    }

    // Get channels
    let channels = 0;
    try {
      const channelsResult = await structure.get_int('channels');
      if (channelsResult.return) {
        channels = channelsResult.value;
      }
    } catch (e) {
      console.warn('Failed to get audio channels:', e);
    }

    // Get layout (optional)
    let layout: string | undefined;
    try {
      const layoutStr = await structure.get_string('layout');
      if (layoutStr) {
        layout = layoutStr;
      }
    } catch (e) {
      // Layout is optional
    }

    return {
      format,
      rate,
      channels,
      layout,
    };
  } catch (error) {
    console.error('Error parsing audio format:', error);
    return null;
  }
}

/**
 * Get a human-readable caps string
 */
export async function getCapsString(caps: GstCaps | null): Promise<string> {
  if (!caps) return 'none';
  
  try {
    return await caps.to_string();
  } catch (error) {
    console.error('Error converting caps to string:', error);
    return 'error';
  }
}
