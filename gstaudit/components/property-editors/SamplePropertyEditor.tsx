/**
 * Property editor for GstSample properties
 * 
 * Provides an on-demand capture button to fetch and view samples
 */

import { Box, Button, Typography, Alert, CircularProgress, Stack } from '@mui/material';
import { PropertyEditorProps } from './types';
import { useState } from 'react';
import { GObjectValue, GstSample } from '@/lib/gst';
import { extractSampleData, SampleData, parseVideoFormat } from '@/components/buffer-viewers';
import { VideoSampleViewer } from '@/components/buffer-viewers';
import { VideoFormatInfo } from '@/components/buffer-viewers/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Helper to safely convert values to strings for display
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'object' && value !== null && 'ptr' in value) {
    return String((value as { ptr: unknown }).ptr);
  }
  return String(value);
}

export function SamplePropertyEditor({ property, element, readOnly }: PropertyEditorProps) {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleData, setSampleData] = useState<SampleData | null>(null);
  const [videoFormatInfo, setVideoFormatInfo] = useState<VideoFormatInfo | null>(null);

  const handleCapture = async () => {
    setCapturing(true);
    setError(null);
    
    try {
      // Get the default value to determine the type
      const defaultValue = await property.paramSpec.get_default_value();
      const valueType = await defaultValue.get_g_type();
      
      // Create and initialize a GValue with the correct type
      const gvalue = await GObjectValue.new();
      await gvalue.init(valueType);
      
      // Get the property value (the sample)
      await element.get_property(property.name, gvalue);
      
      // Extract the boxed pointer (GstSample)
      const samplePtr = await gvalue.get_boxed();
      
      if (!samplePtr) {
        setError('No sample available (property returned null)');
        setSampleData(null);
        return;
      }
      
      // Create a GstSample instance from the pointer
      const sample = await GstSample.create(samplePtr, 'none');
      
      // Extract all sample data
      const data = await extractSampleData(sample);
      setSampleData(data);
      
      // Check if this is a video sample and extract format info
      if (data.caps && data.mediaType?.startsWith('video/')) {
        try {
          const numStructures = await data.caps.get_size();
          if (numStructures > 0) {
            const structure = await data.caps.get_structure(0);
            const formatInfo = await parseVideoFormat(structure);
            if (formatInfo && formatInfo.width > 0 && formatInfo.height > 0) {
              setVideoFormatInfo(formatInfo);
            }
          }
        } catch (err) {
          console.warn('Failed to parse video format:', err);
          setVideoFormatInfo(null);
        }
      } else {
        setVideoFormatInfo(null);
      }
    } catch (err) {
      console.error('Error capturing sample:', err);
      setError(err instanceof Error ? err.message : 'Failed to capture sample');
      setSampleData(null);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={capturing ? <CircularProgress size={16} /> : <CameraAltIcon />}
          onClick={handleCapture}
          disabled={readOnly || capturing}
        >
          {capturing ? 'Capturing...' : 'Capture Sample'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {sampleData && (
        <Box 
          sx={{ 
            p: 1.5, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Captured Sample
          </Typography>
          
          {/* Embedded Video Viewer */}
          {videoFormatInfo && (
            <Box sx={{ mb: 2 }}>
              <VideoSampleViewer sampleData={sampleData} formatInfo={videoFormatInfo} />
            </Box>
          )}
          
          {/* Metadata */}
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <strong>Type:</strong> {formatValue(sampleData.mediaType)}
            </Typography>
            
            {sampleData.caps && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                <strong>Caps:</strong> {formatValue(sampleData.caps)}
              </Typography>
            )}
            
            {sampleData.timestamp !== null && sampleData.timestamp !== undefined && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <strong>PTS:</strong> {formatValue(sampleData.timestamp)}
              </Typography>
            )}
            
            {sampleData.duration !== null && sampleData.duration !== undefined && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <strong>Duration:</strong> {formatValue(sampleData.duration)}
              </Typography>
            )}
            
            {sampleData.bufferSize !== null && sampleData.bufferSize !== undefined && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <strong>Size:</strong> {(Number(sampleData.bufferSize) / 1024).toFixed(2)} KB
              </Typography>
            )}
            
            {sampleData.buffer && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <strong>Buffer:</strong> {formatValue(sampleData.buffer)}
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      {!sampleData && !error && !capturing && (
        <Typography variant="caption" color="text.secondary" display="block">
          Click &quot;Capture Sample&quot; to fetch and view the current sample from this property.
        </Typography>
      )}
    </Box>
  );
}
