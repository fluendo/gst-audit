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
  GObjectParamSpecBoxed,
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
import { BoxedPropertyEditor } from './BoxedPropertyEditor';
import { useState, useEffect, ComponentType } from 'react';
import { Typography, Box } from '@mui/material';

/**
 * Factory component that determines the property type and renders
 * the appropriate editor component.
 *
 * The editor is stored as a component type (rather than a rendered element) so
 * that it is always rendered with the latest props. Storing a rendered element
 * would freeze `property.value` at its initial value, causing editors to skip
 * updates when the value returns to the original one (e.g. an enum value of 0).
 */
export function PropertyEditorFactory(props: PropertyEditorProps) {
  const [Editor, setEditor] = useState<ComponentType<PropertyEditorProps> | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineEditor = async () => {
      setLoading(true);
      setError(null);
      setUnsupported(false);
      setEditor(null);
      try {
        const { property } = props;
        const { paramSpec } = property;

        // Check each type in order of specificity
        if (await paramSpec.isOf(GObjectParamSpecString)) {
          setEditor(() => StringPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecBoolean)) {
          setEditor(() => BooleanPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecInt64)) {
          setEditor(() => Int64PropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecUInt64)) {
          setEditor(() => UInt64PropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecLong)) {
          setEditor(() => LongPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecULong)) {
          setEditor(() => ULongPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecInt)) {
          setEditor(() => IntPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecUInt)) {
          setEditor(() => UIntPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecChar)) {
          setEditor(() => CharPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecUChar)) {
          setEditor(() => UCharPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecDouble)) {
          setEditor(() => DoublePropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecFloat)) {
          setEditor(() => FloatPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecEnum)) {
          setEditor(() => EnumPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecFlags)) {
          setEditor(() => FlagsPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecBoxed)) {
          setEditor(() => BoxedPropertyEditor);
        } else if (await paramSpec.isOf(GObjectParamSpecObject)) {
          setEditor(() => ObjectPropertyEditor);
        } else {
          // Unknown type - show read-only display
          setUnsupported(true);
        }
      } catch (error) {
        console.error('Error determining property editor type:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
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

  if (error) {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="error">
          Error loading editor: {error}
        </Typography>
      </Box>
    );
  }

  if (unsupported) {
    return (
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          {props.property.value}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Unsupported property type
        </Typography>
      </Box>
    );
  }

  if (Editor) {
    return <Editor {...props} />;
  }

  return null;
}
