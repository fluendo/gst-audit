import { Box, Typography } from '@mui/material';

interface StatusBarProps {
  status: string;
}

export function StatusBar({ status }: StatusBarProps) {
  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        px: 2,
        py: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ mr: 1 }}>
        Status:
      </Typography>
      <Typography variant="caption" color="text.primary">
        {status}
      </Typography>
    </Box>
  );
}
