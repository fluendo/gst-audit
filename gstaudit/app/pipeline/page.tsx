'use client';

import { useState, useRef, useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import '../pipeline-theme.css';
import { getConfig, ElementTreeManager } from '@/lib';
import {
  GstPipeline,
} from '@/lib/gst';
import { PipelineGraph, PipelineTreeView, StatusBar, PipelineSelector, ObjectDetails } from '@/components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button, Box, Typography } from '@mui/material';
import { ElementTree } from '@/lib/ElementTreeManager';

export default function PipelinePage() {
  const [status, setStatus] = useState<string>('Ready to connect');
  const [pipelines, setPipelines] = useState<{ name: string; ptr: string }[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [pipelineLoaded, setPipelineLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelinesFetched, setPipelinesFetched] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementTree | null>(null);
  
  const elementTreeManagerRef = useRef<ElementTreeManager | null>(null);
  
  const config = getConfig();

  // Create a new ElementTreeManager when selectedPipeline changes
  useEffect(() => {
    if (selectedPipeline) {
      // Create new instance
      elementTreeManagerRef.current = new ElementTreeManager();
      // Clear selected element when pipeline changes
      setSelectedElement(null);
      // Automatically load the pipeline
      loadPipeline();
    }
  }, [selectedPipeline]);

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
      setPipelinesFetched(true);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPipeline = async () => {
    if (!selectedPipeline || !elementTreeManagerRef.current) {
      return;
    }

    try {
      setPipelineLoaded(false);
      
      const elementTreeManager = elementTreeManagerRef.current;
      elementTreeManager.clear();
      
      // Set status callback to update UI during loading
      elementTreeManager.setStatusCallback((message: string) => {
        setStatus(message);
      });
      
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      await elementTreeManager.generateTree(pipeline);
      
      const tree = elementTreeManager.getRoot();
      if (tree) {
        setPipelineLoaded(true);
      } else {
        setStatus('Error: No tree generated');
      }
    } catch (error) {
      console.error('Error loading pipeline:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Clear the callback after loading is complete
      if (elementTreeManagerRef.current) {
        elementTreeManagerRef.current.setStatusCallback(null);
      }
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
                <Panel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    <PipelineSelector
                      pipelines={pipelines}
                      selectedPipeline={selectedPipeline}
                      onPipelineChange={setSelectedPipeline}
                    />
                    {pipelineLoaded && elementTreeManagerRef.current && (
                      <div className="flex-1 overflow-auto">
                        <PipelineTreeView 
                          treeManager={elementTreeManagerRef.current}
                          selectedElement={selectedElement}
                          onElementSelect={setSelectedElement}
                        />
                      </div>
                    )}
                  </div>
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
                <Panel defaultSize={55} minSize={40}>
                  {pipelineLoaded && elementTreeManagerRef.current ? (
                    <PipelineGraph 
                      treeManager={elementTreeManagerRef.current} 
                      selectedElement={selectedElement}
                      onElementSelect={setSelectedElement}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Loading pipeline...
                    </div>
                  )}
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
                <Panel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <ObjectDetails selectedElement={selectedElement} />
                  </div>
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
