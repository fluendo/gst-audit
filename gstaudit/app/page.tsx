'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/SessionContext';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

/**
 * Landing/Connection Page
 * 
 * This is the entry point where users select which gstaudit-server to connect to.
 * Once connected, the session will be linked to that server.
 */
export default function ConnectionPage() {
  const { connection, setConnection } = useSession();
  const router = useRouter();
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5556');
  const [isConnecting, setIsConnecting] = useState(false);

  // If already connected, redirect to pipeline
  useEffect(() => {
    if (connection) {
      router.push('/pipeline');
    }
  }, [connection, router]);

  const handleConnect = async () => {
    const portNum = parseInt(port);
    
    if (!host || isNaN(portNum) || portNum < 1 || portNum > 65535) {
      alert('Please enter a valid host and port');
      return;
    }

    setIsConnecting(true);

    try {
      // Test connection by trying to fetch from the server
      const response = await fetch(`http://${host}:${portNum}/girest/health`, {
        method: 'GET',
      }).catch(() => null);

      if (!response || !response.ok) {
        // If health check fails, still allow connection (server might not have health endpoint)
        console.warn('Health check failed, but continuing anyway');
      }

      // Set the connection in session context
      setConnection({ host, port: portNum });

      // Navigate to pipeline page
      router.push('/pipeline');
    } catch (error) {
      console.error('Connection error:', error);
      alert(`Failed to connect to ${host}:${port}. Please check the server is running.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <StorageIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              GstAudit
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connect to a GStreamer Audit Server
            </Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleConnect(); }}>
            <TextField
              fullWidth
              label="Host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              placeholder="localhost"
              helperText="Server hostname or IP address"
            />

            <TextField
              fullWidth
              label="Port"
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              placeholder="5556"
              helperText="GIRest server port"
              inputProps={{ min: 1, max: 65535 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleConnect}
              disabled={isConnecting}
              sx={{ mt: 3 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Make sure the gstaudit-server is running.
              Default configuration: localhost:9000
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
