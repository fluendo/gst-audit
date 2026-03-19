/**
 * Property editor for GParamSpecBoxed types
 * 
 * Detects the specific boxed type and delegates to appropriate handlers
 */

import { Typography, Box, CircularProgress } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState, useEffect } from 'react';
import { GstSample, GstCaps, GstStructure, GstBuffer } from '@/lib/gst';

/**
 * Known boxed type names that we can handle
 */
enum BoxedType {
  GST_SAMPLE = 'GstSample',
  GST_CAPS = 'GstCaps',
  GST_STRUCTURE = 'GstStructure',
  GST_BUFFER = 'GstBuffer',
  UNKNOWN = 'unknown',
}

export function BoxedPropertyEditor(props: PropertyEditorProps) {
  const [boxedType, setBoxedType] = useState<BoxedType>(BoxedType.UNKNOWN);
  const [loading, setLoading] = useState(true);
  const [EditorComponent, setEditorComponent] = useState<React.ComponentType<PropertyEditorProps> | null>(null);

  useEffect(() => {
    const detectBoxedType = async () => {
      setLoading(true);
      try {
        const { property } = props;
        
        // Get the GType from the property's default value
        const defaultValue = await property.paramSpec.get_default_value();
        const valueGType = await defaultValue.get_g_type();
        
        // Compare with known GTypes directly
        let detectedType = BoxedType.UNKNOWN;
        
        // Get GTypes for known boxed types
        const sampleGType = await GstSample.get_type();
        const capsGType = await GstCaps.get_type();
        const structureGType = await GstStructure.get_type();
        const bufferGType = await GstBuffer.get_type();
        
        console.log('Property:', property.name, 'valueGType:', valueGType);
        console.log('Comparing with - Sample:', sampleGType, 'Caps:', capsGType, 'Structure:', structureGType, 'Buffer:', bufferGType);
        
        if (valueGType === sampleGType) {
          detectedType = BoxedType.GST_SAMPLE;
          console.log('Detected GstSample property!');
        } else if (valueGType === capsGType) {
          detectedType = BoxedType.GST_CAPS;
        } else if (valueGType === structureGType) {
          detectedType = BoxedType.GST_STRUCTURE;
        } else if (valueGType === bufferGType) {
          detectedType = BoxedType.GST_BUFFER;
        }
        
        setBoxedType(detectedType);
        
        // Dynamically import the appropriate editor
        if (detectedType === BoxedType.GST_SAMPLE) {
          const editorModule = await import('./SamplePropertyEditor');
          setEditorComponent(() => editorModule.SamplePropertyEditor);
        }
      } catch (error) {
        console.error('Error detecting boxed type:', error);
        setBoxedType(BoxedType.UNKNOWN);
      } finally {
        setLoading(false);
      }
    };

    detectBoxedType();
  }, [props.property]);

  if (loading) {
    return (
      <Box sx={{ mt: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, display: 'inline' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Render the dynamically loaded component
  if (EditorComponent) {
    return <EditorComponent {...props} />;
  }

  // Delegate to specific editor based on type
  switch (boxedType) {
    case BoxedType.GST_CAPS:
    case BoxedType.GST_STRUCTURE:
    case BoxedType.GST_BUFFER:
      // These types could have custom editors in the future
      return (
        <Box sx={{ mt: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'monospace', 
              color: 'text.secondary',
              fontStyle: 'italic' 
            }}
          >
            {props.property.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Boxed type: {boxedType} (viewer not yet implemented)
          </Typography>
        </Box>
      );
    
    case BoxedType.UNKNOWN:
    default:
      return (
        <Box sx={{ mt: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'monospace', 
              color: 'text.secondary',
              fontStyle: 'italic' 
            }}
          >
            {props.property.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Unknown boxed type (read-only)
          </Typography>
        </Box>
      );
  }
}
