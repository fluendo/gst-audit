import { TextField } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function StringPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleBlur = async () => {
    if (localValue === property.value) return;
    
    setError(null);
    setSaving(true);
    try {
      await onPropertyChange(property.name, localValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      setLocalValue(property.value); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <TextField
      fullWidth
      size="small"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      disabled={readOnly || saving}
      error={!!error}
      helperText={error}
      sx={{ mt: 1 }}
    />
  );
}
