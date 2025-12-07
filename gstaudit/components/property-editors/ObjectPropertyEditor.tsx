import { Typography, Box } from '@mui/material';
import { PropertyEditorProps } from './types';

export function ObjectPropertyEditor({ property }: PropertyEditorProps) {
  // Object properties are read-only for now
  // They would require a special object picker UI
  
  return (
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
        Object properties are read-only
      </Typography>
    </Box>
  );
}
