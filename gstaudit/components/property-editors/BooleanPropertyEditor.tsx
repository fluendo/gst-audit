import { Switch, FormControlLabel, Box } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';

export function BooleanPropertyEditor({ property, onPropertyChange, readOnly }: PropertyEditorProps) {
  const [localValue, setLocalValue] = useState(property.value === 'true');
  const [saving, setSaving] = useState(false);

  const handleChange = async (checked: boolean) => {
    setLocalValue(checked);
    setSaving(true);
    try {
      await onPropertyChange(property.name, checked.toString());
    } catch (err) {
      console.error('Failed to update boolean property:', err);
      setLocalValue(!checked); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={localValue}
            onChange={(e) => handleChange(e.target.checked)}
            disabled={readOnly || saving}
            size="small"
          />
        }
        label={localValue ? 'True' : 'False'}
      />
    </Box>
  );
}
