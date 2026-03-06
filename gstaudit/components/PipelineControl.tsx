'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import { GstPipeline, GObject, getCallbackHandler } from '@/lib/gst';
import type { GstMessage, GstBus } from '@/lib/gst';
import { useSession } from '@/lib/SessionContext';

interface PipelineControlProps {
  pipeline: GstPipeline | null;
}

export function PipelineControl({ pipeline }: PipelineControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const pipelineRef = useRef<GstPipeline | null>(null);
  const signalHandlerIdRef = useRef<number | null>(null);

  // Get session from context
  const { sessionId, callbackSecret } = useSession();

  // Update pipeline reference and setup signal handlers when pipeline changes
  useEffect(() => {
    const setupPipeline = async () => {
      // Cleanup previous pipeline
      if (signalHandlerIdRef.current !== null && pipelineRef.current) {
        try {
          const bus = await pipelineRef.current.get_bus();
          if (bus) {
            // Disconnect the signal handler
            await GObject.signal_handler_disconnect(
              bus,
              signalHandlerIdRef.current
            );
            console.log('Disconnected sync-message signal');
          }
        } catch (error) {
          console.error('Error disconnecting signal:', error);
        }
        signalHandlerIdRef.current = null;
      }

      if (pipeline) {
        pipelineRef.current = pipeline;
        
        try {
          // Get the pipeline bus
          const bus = await pipeline.get_bus();
          if (bus) {
            // Enable sync message emission
            await bus.enable_sync_message_emission();
            console.log('Enabled sync message emission');

            // Get callback handler
            const handler = getCallbackHandler();
            if (!handler) {
              console.error('Callback handler not configured');
              return;
            }

            // Connect to sync-message signal
            console.log('Connecting to sync-message signal with sessionId:', sessionId);
            const handlerId = await bus.connect_sync_message(
              sessionId,
              callbackSecret,
              'default',
              (self: GstBus, message: GstMessage) => {
                console.log('Sync message received!', { message, sessionId });
                // TODO: Parse message and update state based on message type
              }
            );
            
            signalHandlerIdRef.current = handlerId;
            console.log('Connected to sync-message signal, handler ID:', handlerId);
          }
        } catch (error) {
          console.error('Error setting up pipeline signals:', error);
        }
      } else {
        pipelineRef.current = null;
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
      }
    };

    setupPipeline();

    // Cleanup on unmount
    return () => {
      if (signalHandlerIdRef.current !== null && pipelineRef.current) {
        const cleanup = async () => {
          try {
            const bus = await pipelineRef.current!.get_bus();
            if (bus) {
              await GObject.signal_handler_disconnect(
                bus,
                signalHandlerIdRef.current!
              );
            }
          } catch (error) {
            console.error('Error in cleanup:', error);
          }
        };
        cleanup();
      }
    };
  }, [pipeline, sessionId, callbackSecret]);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (!pipelineRef.current) return;

    try {
      if (isPlaying) {
        // Pause the pipeline
        await pipelineRef.current.set_state('paused');
        setIsPlaying(false);
      } else {
        // Play the pipeline
        await pipelineRef.current.set_state('playing');
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error changing pipeline state:', error);
    }
  };

  const handleStop = async () => {
    if (!pipelineRef.current) return;

    try {
      // Set pipeline to NULL state
      await pipelineRef.current.set_state('null');
      setIsPlaying(false);
      setPosition(0);
    } catch (error) {
      console.error('Error stopping pipeline:', error);
    }
  };

  const handleSeek = (_event: Event, value: number | number[]) => {
    const newPosition = value as number;
    setPosition(newPosition);
    // TODO: Implement seek logic with GStreamer API
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleSkipBackward = () => {
    const newPosition = Math.max(0, position - 10);
    setPosition(newPosition);
    // TODO: Implement skip backward with GStreamer API
  };

  const handleSkipForward = () => {
    const newPosition = Math.min(duration, position + 10);
    setPosition(newPosition);
    // TODO: Implement skip forward with GStreamer API
  };

  if (!pipeline) {
    return (
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No pipeline loaded
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Seek bar */}
      <Box sx={{ mb: 1, px: 1 }}>
        <Slider
          value={position}
          max={duration || 100}
          onChange={handleSeek}
          onChangeCommitted={handleSeekEnd}
          onMouseDown={handleSeekStart}
          aria-label="Position"
          size="small"
          sx={{
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(position)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <IconButton size="small" onClick={handleSkipBackward} aria-label="Skip backward">
          <FastRewindIcon />
        </IconButton>
        <IconButton size="small" onClick={handleStop} aria-label="Stop">
          <StopIcon />
        </IconButton>
        <IconButton size="medium" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
        <IconButton size="small" onClick={handleSkipForward} aria-label="Skip forward">
          <FastForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
