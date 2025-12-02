'use client';

import { useState, useRef } from 'react';
import '@xyflow/react/dist/style.css';
import '../pipeline-theme.css';
import { getConfig, ElementTreeManager } from '@/lib';
import {
  GstPipeline,
} from '@/lib/gst';
import { PipelineGraph, PipelineTreeView, StatusBar, PipelineSelector } from '@/components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button, Box, Typography } from '@mui/material';

export default function PipelinePage() {
  const [status, setStatus] = useState<string>('Ready to connect');
  const [pipelines, setPipelines] = useState<{ name: string; ptr: string }[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [pipelineLoaded, setPipelineLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelinesFetched, setPipelinesFetched] = useState(false);
  
  const elementTreeManager = useRef(new ElementTreeManager()).current;
  
  const config = getConfig();

  const fetchPipelines = async () => {
    try {
      setIsLoading(true);
      setStatus('Fetching pipelines...');
      const response = await fetch(`${config.gstauditBaseUrl}/GstAudit/pipelines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pipelinesData = await response.json();

      const allPipelines: { name: string; ptr: string }[] = [];

      for (const pipeline of pipelinesData) {
        allPipelines.push({ name: pipeline.name, ptr: pipeline.ptr });
      }

      setPipelines(allPipelines);
      setStatus(`Found ${allPipelines.length} pipeline(s)`);
      console.log('Pipelines:', allPipelines);
      if (allPipelines.length > 0) {
        setSelectedPipeline(allPipelines[0].ptr);
        setPipelinesFetched(true);
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPipeline = async () => {
    if (!selectedPipeline) {
      alert('No pipeline selected!');
      return;
    }

    try {
      setStatus('Loading pipeline...');
      setPipelineLoaded(false);
      elementTreeManager.clear();
      
      // Set status callback to update UI during loading
      elementTreeManager.setStatusCallback((message: string) => {
        setStatus(message);
      });
      
      console.log('========================================');
      console.log('[LOAD] Starting pipeline load');
      console.log('========================================');
      
      const loadStart = performance.now();
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      
      await elementTreeManager.generateTree(pipeline);
      
      const loadEnd = performance.now();
      const totalTime = (loadEnd - loadStart).toFixed(2);
      
      const tree = elementTreeManager.getRoot();
      if (tree) {
        const flatTree = elementTreeManager.getFlatTree();
        const elementCount = flatTree.length;
        const padCount = flatTree.reduce((sum, node) => sum + node.pads.length, 0);
        
        console.log('========================================');
        console.log(`[LOAD] Pipeline loaded successfully:`);
        console.log(`[LOAD] - Total time: ${totalTime}ms`);
        console.log(`[LOAD] - Elements: ${elementCount}`);
        console.log(`[LOAD] - Pads: ${padCount}`);
        console.log('========================================');
        
        setStatus(`Pipeline loaded: ${totalTime}ms - ${elementCount} elements, ${padCount} pads`);
        setPipelineLoaded(true);
      } else {
        setStatus('Error: No tree generated');
      }
    } catch (error) {
      console.error('Error loading pipeline:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Clear the callback after loading is complete
      elementTreeManager.setStatusCallback(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {!pipelinesFetched ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 3,
            p: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Pipeline Visualization
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            API: <code style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
              {config.gstauditBaseUrl}
            </code>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={fetchPipelines}
            disabled={isLoading}
          >
            {isLoading ? 'Fetching Pipelines...' : 'Fetch Pipelines'}
          </Button>
          {status !== 'Ready to connect' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {status}
            </Typography>
          )}
        </Box>
      ) : (
        <div className="flex-1">
          <PanelGroup direction="vertical">
            <Panel defaultSize={95} minSize={95}>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={25} minSize={15} maxSize={40}>
                  <div className="h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    <PipelineSelector
                      pipelines={pipelines}
                      selectedPipeline={selectedPipeline}
                      onPipelineChange={setSelectedPipeline}
                    />
                    {pipelineLoaded && (
                      <div className="flex-1 overflow-auto">
                        <PipelineTreeView treeManager={elementTreeManager} />
                      </div>
                    )}
                  </div>
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
                <Panel defaultSize={75} minSize={60}>
                  {pipelineLoaded ? (
                    <PipelineGraph treeManager={elementTreeManager} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Button
                        variant="contained"
                        size="large"
                        onClick={loadPipeline}
                      >
                        Load Pipeline
                      </Button>
                    </div>
                  )}
                </Panel>
              </PanelGroup>
            </Panel>
            <Panel defaultSize={5} minSize={5} maxSize={5}>
              <StatusBar status={status} />
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}
