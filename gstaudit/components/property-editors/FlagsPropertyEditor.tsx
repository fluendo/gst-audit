import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function FlagsPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // TODO: In the future, we can fetch flag definitions from the ParamSpec
  // and display checkboxes for each flag instead of a text input
  
  const validateFlags = (value: string): boolean => {
    if (value === '') return false; // Empty is not valid
    // Accept decimal or hex (0x prefix)
    if (value.startsWith('0x') || value.startsWith('0X')) {
      const hexPart = value.substring(2);
      return /^[0-9a-fA-F]+$/.test(hexPart);
    }
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num.toString() === value;
  };

  const handleChange = (value: string) => {
    setLocalValue(value);
    // Allow empty, '0x', or '0X' while typing
    if (value === '' || value === '0x' || value === '0X') {
      setError(null);
    } else if (!validateFlags(value)) {
      setError('Must be a valid flags value (integer or hex with 0x prefix)');
    } else {
      setError(null);
    }
  };

  const handleBlur = async () => {
    if (!validateFlags(localValue)) {
      setError('Invalid flags value');
      setLocalValue(property.value);
      return;
    }
    
    // Convert to decimal for API
    const normalizedValue = localValue.startsWith('0x') || localValue.startsWith('0X')
      ? parseInt(localValue, 16).toString()
      : localValue;
    
    if (normalizedValue === property.value) return;

    setError(null);
    setSaving(true);
    try {
      await onPropertyChange(property.name, normalizedValue);
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
      helperText={error || 'Enter flags value (decimal or hex with 0x prefix)'}
      sx={{ mt: 1 }}
    />
  );
}
