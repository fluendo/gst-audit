import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function UIntPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validateUInt = (value: string): boolean => {
    if (value === '') return true;
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num.toString() === value;
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    if (value !== '' && !validateUInt(value)) {
      setError('Must be a non-negative integer');
    } else {
      setError(null);
    }
  };

  const handleBlur = async () => {
    if (!validateUInt(localValue) || localValue === '') {
      setError('Invalid unsigned integer value');
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
      helperText={error}
      sx={{ mt: 1 }}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*'
      }}
    />
  );
}
