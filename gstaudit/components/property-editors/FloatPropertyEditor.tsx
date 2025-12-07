import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function FloatPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validateFloat = (value: string): boolean => {
    if (value === '' || value === '-' || value === '.' || value === '-.') return true;
    const num = parseFloat(value);
    return !isNaN(num);
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    if (value !== '' && !validateFloat(value)) {
      setError('Must be a valid number');
    } else {
      setError(null);
    }
  };

  const handleBlur = async () => {
    if (!validateFloat(localValue) || localValue === '' || localValue === '-' || localValue === '.' || localValue === '-.') {
      setError('Invalid number value');
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
        inputMode: 'decimal',
        pattern: '-?[0-9]*\\.?[0-9]*'
      }}
    />
  );
}
