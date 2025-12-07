import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function IntPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validateInt = (value: string): boolean => {
    if (value === '' || value === '-') return true; // Allow empty or minus sign while typing
    const num = parseInt(value, 10);
    return !isNaN(num) && num.toString() === value;
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    if (value !== '' && value !== '-' && !validateInt(value)) {
      setError('Must be a valid integer');
    } else {
      setError(null);
    }
  };

  const handleBlur = async () => {
    if (!validateInt(localValue) || localValue === '' || localValue === '-') {
      setError('Invalid integer value');
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
        pattern: '-?[0-9]*'
      }}
    />
  );
}
