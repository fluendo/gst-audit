import { GObjectParamSpec, GObjectValue, GstElement } from '@/lib/gst';

/**
 * Enhanced property data structure that includes metadata for editing
 */
export interface PropertyData {
  name: string;
  nick: string;
  blurb: string | null;
  value: string;
  paramSpec: GObjectParamSpec;
  isReadable: boolean;
  isWritable: boolean;
}

/**
 * Common props for all property editor components
 */
export interface PropertyEditorProps {
  property: PropertyData;
  element: GstElement;
  onPropertyChange: (name: string, newValue: string) => Promise<void>;
  readOnly?: boolean;
}

/**
 * Result of a property update operation
 */
export interface PropertyUpdateResult {
  success: boolean;
  error?: string;
  newValue?: string;
}
