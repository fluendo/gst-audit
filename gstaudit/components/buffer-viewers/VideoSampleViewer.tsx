/**
 * Component to render video frames from GstSample
 */

import { Box, Typography, Paper, Alert } from '@mui/material';
import { VideoViewerProps } from './types';
import { useState, useEffect, useRef } from 'react';
import { GstMapInfo, GstCaps, GstSample, GstMapFlags } from '@/lib/gst';
import { GstVideo } from '@/lib/GstVideo/GstVideo';

export function VideoSampleViewer({ sampleData, formatInfo }: VideoViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Callback ref to detect when canvas is mounted
  const canvasCallbackRef = (element: HTMLCanvasElement | null) => {
    canvasRef.current = element;
    if (element) {
      setCanvasReady(true);
    }
  };

  useEffect(() => {
    // Atomic check: only proceed if ALL dependencies are ready
    if (!canvasReady || !canvasRef.current || !sampleData.buffer || !formatInfo.width || !formatInfo.height) {
      return;
    }
    
    const renderFrame = async () => {
      setRendering(true);
      setError(null);
      setRenderComplete(false);

      try {
        console.log('Converting video frame using server-side GstVideo API:', {
          format: formatInfo.format,
          width: formatInfo.width,
          height: formatInfo.height,
          bufferSize: sampleData.bufferSize,
        });
        
        // Create target caps for RGBA format
        const targetCapsString = `video/x-raw,format=RGBA,width=${formatInfo.width},height=${formatInfo.height}`;
        console.log('Creating target caps:', targetCapsString);
        const targetCaps = await GstCaps.from_string(targetCapsString);
        console.log('Target caps created:', targetCaps);
        
        if (!targetCaps) {
          setError('Failed to create target caps for RGBA format');
          return;
        }
        
        // Get the sample object (we need to reconstruct it from the buffer)
        // For now, we'll need to get the sample from the property value
        // The sampleData should contain the sample pointer
        const sample = sampleData.sample as GstSample;
        
        if (!sample) {
          setError('No sample available for conversion');
          return;
        }
        
        console.log('Sample object:', sample);
        
        // Convert the sample using GstVideo.video_convert_sample
        // Timeout: 5 seconds = 5000000000 nanoseconds
        console.log('Calling GstVideo.video_convert_sample...');
        const convertedSample = await GstVideo.video_convert_sample(
          sample,
          targetCaps,
          5000000000
        );
        
        console.log('Converted sample result:', convertedSample);
        
        if (!convertedSample) {
          setError('Failed to convert video sample to RGBA - conversion returned null');
          return;
        }
        
        // Get the converted buffer
        console.log('Getting buffer from converted sample...');
        const convertedBuffer = await convertedSample.get_buffer();
        console.log('Converted buffer:', convertedBuffer);
        
        if (!convertedBuffer) {
          setError('No buffer in converted sample');
          return;
        }
        
        // Map the converted buffer to get RGBA data
        console.log('Creating new GstMapInfo...');
        const mapInfo = await GstMapInfo.new();
        console.log('MapInfo created:', mapInfo);
        
        console.log('Mapping converted buffer with READ flag...');
        const mapped = await convertedBuffer.map(mapInfo, GstMapFlags.READ);
        console.log('Map result:', mapped);
        
        if (!mapped) {
          setError('Failed to map converted buffer for reading');
          await mapInfo.free();
          return;
        }

        try {
          // Get the RGBA pixel data
          console.log('Getting data from mapInfo...');
          let rgbaData;
          try {
            rgbaData = await mapInfo.get_data();
            console.log('Got data, length:', rgbaData?.length);
          } catch (dataErr) {
            console.error('Error getting data:', dataErr);
            setError('Failed to get pixel data from mapped buffer: ' + (dataErr instanceof Error ? dataErr.message : String(dataErr)));
            return;
          }
          
          console.log('Getting data size...');
          const dataSize = await mapInfo.get_size();
          
          console.log(`Mapped ${dataSize} bytes of RGBA video data`);
          
          // Render to canvas
          const canvas = canvasRef.current;
          console.log('Canvas ref:', canvas);
          if (canvas) {
            console.log('Setting canvas dimensions:', formatInfo.width, 'x', formatInfo.height);
            canvas.width = formatInfo.width;
            canvas.height = formatInfo.height;
            
            const ctx = canvas.getContext('2d');
            console.log('Got canvas context:', ctx);
            if (ctx) {
              console.log('Creating ImageData with', rgbaData.length, 'bytes');
              // Create ImageData from RGBA array
              const imageData = new ImageData(
                new Uint8ClampedArray(rgbaData),
                formatInfo.width,
                formatInfo.height
              );
              
              console.log('Putting image data on canvas...');
              // Put image data on canvas
              ctx.putImageData(imageData, 0, 0);
              
              console.log('Frame rendered successfully to canvas');
              setRenderComplete(true);
            } else {
              console.error('Failed to get 2D context from canvas');
              setError('Failed to get 2D context from canvas');
            }
          } else {
            console.error('Canvas ref is null - canvas not yet mounted');
            // Don't set error here - the canvas might not be mounted yet
            // The useEffect will re-run when it becomes available
          }
        } finally {
          // Always unmap the buffer
          await convertedBuffer.unmap(mapInfo);
          await mapInfo.free();
        }
      } catch (err) {
        console.error('Error rendering video frame:', err);
        setError(err instanceof Error ? err.message : 'Failed to render frame');
      } finally {
        setRendering(false);
      }
    };

    renderFrame();
  }, [sampleData, formatInfo, canvasReady]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {rendering && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Rendering video frame...
        </Alert>
      )}

      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          backgroundImage: `
            linear-gradient(45deg, rgba(128, 128, 128, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(128, 128, 128, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.1) 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <canvas
          ref={canvasCallbackRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        />
      </Paper>

      <Box>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Video Information
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
          Resolution: {formatInfo.width} × {formatInfo.height}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
          Format: {formatInfo.format}
        </Typography>
        {formatInfo.framerate && (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            Framerate: {formatInfo.framerate}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
