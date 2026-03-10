import { Select, MenuItem, FormControl, CircularProgress, FormHelperText } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState, useEffect } from 'react';
import { GObject, GObjectEnumClass, GObjectEnumValue } from '@/lib/gst';

interface EnumValueInfo {
  value: number;
  nick: string;
  name: string;
}

export function EnumPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [enumValues, setEnumValues] = useState<EnumValueInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnumValues = async () => {
      setLoading(true);
      try {
        // Get the default value to determine the enum type
        const defaultValue = await property.paramSpec.get_default_value();
        const enumGType = await defaultValue.get_g_type();
        
        // Get the enum class from the GType and cast it to GObjectEnumClass
        const typeClass = await GObject.type_class_ref(enumGType);
        const enumClass = await GObjectEnumClass.create(typeClass.ptr, 'none');
        
        // Get the number of enum values
        const nValues = await enumClass.get_n_values();
        
        // Get the values array (pointer to first element)
        const valuesPtr = await enumClass.get_values();
        
        if (!valuesPtr) {
          setError('No enum values found');
          return;
        }
        
        // Fetch all enum values from the array
        const values: EnumValueInfo[] = [];
        for (let i = 0; i < nValues; i++) {
          // Calculate the pointer offset for array element i
          // GEnumValue is typically 16 bytes (4-byte int + two 8-byte pointers)
          // But we'll use enum_get_value to safely get each value
          const enumValueInfo = await GObject.enum_get_value(enumClass, i);
          if (enumValueInfo) {
            const value = await enumValueInfo.get_value();
            const nick = await enumValueInfo.get_value_nick();
            const name = await enumValueInfo.get_value_name();
            
            values.push({ value, nick, name });
          }
        }
        
        setEnumValues(values);
      } catch (err) {
        console.error('Error fetching enum values:', err);
        setError('Failed to load enum values');
      } finally {
        setLoading(false);
      }
    };

    fetchEnumValues();
  }, [property.paramSpec]);

  const handleChange = async (value: string) => {
    setLocalValue(value);
    
    if (value === property.value) return;

    setSaving(true);
    setError(null);
    try {
      await onPropertyChange(property.name, value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      setLocalValue(property.value);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <CircularProgress size={20} />
      </FormControl>
    );
  }

  if (error && !enumValues) {
    return (
      <FormControl fullWidth size="small" error sx={{ mt: 1 }}>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth size="small" sx={{ mt: 1 }} error={!!error}>
      <Select
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={readOnly || saving}
      >
        {enumValues?.map((enumValue) => (
          <MenuItem key={enumValue.value} value={enumValue.value.toString()}>
            {enumValue.nick} ({enumValue.value})
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
