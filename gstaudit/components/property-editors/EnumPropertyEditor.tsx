import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function EnumPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // TODO: In the future, we can fetch enum values from the ParamSpec
  // and display a dropdown select instead of a text input
  
  const validateEnum = (value: string): boolean => {
    if (value === '') return false; // Empty is not valid
    const num = parseInt(value, 10);
    return !isNaN(num) && num.toString() === value;
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    // Validate as user types, but allow empty temporarily
    if (value === '' || value === '-') {
      setError(null); // Allow empty or minus sign while typing
    } else if (!validateEnum(value)) {
      setError('Must be a valid enum value (integer)');
    } else {
      setError(null);
    }
  };

  const handleBlur = async () => {
    if (!validateEnum(localValue)) {
      setError('Invalid enum value');
      setLocalValue(property.value);
      return;
    }
    
    if (localValue === property.value) return;

    setError(null);
    setSaving(true);
    try {
      await onPropertyChange(property.name, localValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      setLocalValue(property.value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TextField
      fullWidth
      size="small"
      type="text"
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      disabled={readOnly || saving}
      error={!!error}
      helperText={error || 'Enter enum value as integer'}
      sx={{ mt: 1 }}
      inputProps={{
        inputMode: 'numeric',
        pattern: '-?[0-9]*'
      }}
    />
  );
}
