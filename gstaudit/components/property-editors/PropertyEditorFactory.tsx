import { PropertyEditorProps } from './types';
import {
  GObjectParamSpecBoolean,
  GObjectParamSpecInt,
  GObjectParamSpecUInt,
  GObjectParamSpecLong,
  GObjectParamSpecULong,
  GObjectParamSpecInt64,
  GObjectParamSpecUInt64,
  GObjectParamSpecFloat,
  GObjectParamSpecDouble,
  GObjectParamSpecString,
  GObjectParamSpecEnum,
  GObjectParamSpecFlags,
  GObjectParamSpecObject,
  GObjectParamSpecChar,
  GObjectParamSpecUChar,
} from '@/lib/gst';
import { StringPropertyEditor } from './StringPropertyEditor';
import { BooleanPropertyEditor } from './BooleanPropertyEditor';
import { IntPropertyEditor } from './IntPropertyEditor';
import { UIntPropertyEditor } from './UIntPropertyEditor';
import { LongPropertyEditor } from './LongPropertyEditor';
import { ULongPropertyEditor } from './ULongPropertyEditor';
import { Int64PropertyEditor } from './Int64PropertyEditor';
import { UInt64PropertyEditor } from './UInt64PropertyEditor';
import { FloatPropertyEditor } from './FloatPropertyEditor';
import { DoublePropertyEditor } from './DoublePropertyEditor';
import { CharPropertyEditor } from './CharPropertyEditor';
import { UCharPropertyEditor } from './UCharPropertyEditor';
import { EnumPropertyEditor } from './EnumPropertyEditor';
import { FlagsPropertyEditor } from './FlagsPropertyEditor';
import { ObjectPropertyEditor } from './ObjectPropertyEditor';
import { useState, useEffect, ReactElement } from 'react';
import { Typography, Box } from '@mui/material';

/**
 * Factory component that determines the property type and renders
 * the appropriate editor component
 */
export function PropertyEditorFactory(props: PropertyEditorProps) {
  const [editorComponent, setEditorComponent] = useState<ReactElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineEditor = async () => {
      setLoading(true);
      try {
        const { property } = props;
        const { paramSpec } = property;

        // Check each type in order of specificity
        if (await paramSpec.isOf(GObjectParamSpecString)) {
          setEditorComponent(<StringPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecBoolean)) {
          setEditorComponent(<BooleanPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecInt64)) {
          setEditorComponent(<Int64PropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecUInt64)) {
          setEditorComponent(<UInt64PropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecLong)) {
          setEditorComponent(<LongPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecULong)) {
          setEditorComponent(<ULongPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecInt)) {
          setEditorComponent(<IntPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecUInt)) {
          setEditorComponent(<UIntPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecChar)) {
          setEditorComponent(<CharPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecUChar)) {
          setEditorComponent(<UCharPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecDouble)) {
          setEditorComponent(<DoublePropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecFloat)) {
          setEditorComponent(<FloatPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecEnum)) {
          setEditorComponent(<EnumPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecFlags)) {
          setEditorComponent(<FlagsPropertyEditor {...props} />);
        } else if (await paramSpec.isOf(GObjectParamSpecObject)) {
          setEditorComponent(<ObjectPropertyEditor {...props} />);
        } else {
          // Unknown type - show read-only display
          setEditorComponent(
            <Box sx={{ mt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  color: 'text.secondary',
                  fontStyle: 'italic' 
                }}
              >
                {property.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Unsupported property type
              </Typography>
            </Box>
          );
        }
      } catch (error) {
        console.error('Error determining property editor type:', error);
        setEditorComponent(
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="error">
              Error loading editor: {error instanceof Error ? error.message : 'Unknown error'}
            </Typography>
          </Box>
        );
      } finally {
        setLoading(false);
      }
    };

    determineEditor();
  }, [props.property.paramSpec, props.property.name]);

  if (loading) {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Loading editor...
        </Typography>
      </Box>
    );
  }

  return editorComponent;
}
