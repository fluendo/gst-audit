import { Box, Typography, Paper } from '@mui/material';
import { ElementTree } from '@/lib/ElementTreeManager';
import { GstPadDirection } from '@/lib/gst';

interface ObjectDetailsProps {
  selectedElement: ElementTree | null;
}

export function ObjectDetails({ selectedElement }: ObjectDetailsProps) {
  if (!selectedElement) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Select an element to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Element Details
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Name
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            ID
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {selectedElement.id}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Level
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.level}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Children
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedElement.children.length}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Pads
          </Typography>
          <Typography variant="body2">
            {selectedElement.pads.length} ({selectedElement.pads.filter(p => p.direction === GstPadDirection.SINK).length} sink, {selectedElement.pads.filter(p => p.direction === GstPadDirection.SRC).length} src)
          </Typography>
        </Box>
      </Paper>

      {selectedElement.pads.length > 0 && (
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pads
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedElement.pads.map((pad) => (
              <Box key={pad.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight="medium">
                  {pad.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Direction: {pad.direction === GstPadDirection.SINK ? 'Sink' : pad.direction === GstPadDirection.SRC ? 'Src' : 'Unknown'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Type: {pad.isGhost ? 'Ghost' : 'Regular'} {pad.isInternal ? '(Internal)' : ''}
                </Typography>
                {pad.linkedTo && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Linked: Yes
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
