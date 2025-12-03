'use client';

import { useState, useRef, useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import '../pipeline-theme.css';
import { getConfig, ElementTreeManager, FactoryTreeManager } from '@/lib';
import {
  GstPipeline,
} from '@/lib/gst';
import { PipelineGraph, PipelineTreeView, StatusBar, PipelineSelector, ObjectDetails, FactoriesTreeView, FactoryDetail } from '@/components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button, Box, Typography, Tabs, Tab } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FactoryIcon from '@mui/icons-material/Factory';
import { ElementTree } from '@/lib/ElementTreeManager';

export default function PipelinePage() {
  const [pipelineStatus, setPipelineStatus] = useState<string>('Ready to connect');
  const [factoryStatus, setFactoryStatus] = useState<string>('');
  const [pipelines, setPipelines] = useState<{ name: string; ptr: string }[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [pipelineLoaded, setPipelineLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelinesFetched, setPipelinesFetched] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementTree | null>(null);
  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const elementTreeManagerRef = useRef<ElementTreeManager | null>(null);
  const factoryTreeManagerRef = useRef<FactoryTreeManager | null>(null);
  
  const config = getConfig();

  // Compose status from both pipeline and factory statuses
  const composedStatus = [pipelineStatus, factoryStatus]
    .filter(s => s && s !== 'Ready to connect')
    .join(' | ') || 'Ready to connect';

  // Handle element selection and fetch its factory
  const handleElementSelect = async (element: ElementTree | null) => {
    setSelectedElement(element);
    
    if (element) {
      try {
        // Get the factory from the element
        const factory = await element.element.get_factory();
        if (factory) {
          const factoryName = await factory.get_name();
          setSelectedFactory(factoryName);
        } else {
          setSelectedFactory(null);
        }
      } catch (error) {
        console.error('Error getting factory for element:', error);
        setSelectedFactory(null);
      }
    } else {
      setSelectedFactory(null);
    }
  };

  // Initialize FactoryTreeManager once
  useEffect(() => {
    if (!factoryTreeManagerRef.current) {
      factoryTreeManagerRef.current = new FactoryTreeManager();
      // Set status callback to update UI during loading
      factoryTreeManagerRef.current.setStatusCallback((message: string) => {
        setFactoryStatus(message);
      });
    }
  }, []);

  // Load factories when switching to factories tab for the first time
  useEffect(() => {
    if (activeTab === 1 && factoryTreeManagerRef.current) {
      const manager = factoryTreeManagerRef.current;
      if (!manager.getRoot() && !manager.isLoading()) {
        manager.loadFactories().catch(err => {
          console.error('Failed to load factories:', err);
        });
      }
    }
  }, [activeTab]);

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
      setPipelineStatus('Fetching pipelines...');
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
      setPipelineStatus(`Found ${allPipelines.length} pipeline(s)`);
      console.log('Pipelines:', allPipelines);
      setPipelinesFetched(true);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setPipelineStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        setPipelineStatus(message);
      });
      
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      await elementTreeManager.generateTree(pipeline);
      
      const tree = elementTreeManager.getRoot();
      if (tree) {
        setPipelineLoaded(true);
      } else {
        setPipelineStatus('Error: No tree generated');
      }
    } catch (error) {
      console.error('Error loading pipeline:', error);
      setPipelineStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          {composedStatus !== 'Ready to connect' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {composedStatus}
            </Typography>
          )}
        </Box>
      ) : (
        <div className="flex-1">
          <PanelGroup direction="vertical">
            <Panel defaultSize={95} minSize={95}>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full flex">
                    {/* Vertical Tabs */}
                    <Box
                      sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Tabs
                        orientation="vertical"
                        value={activeTab}
                        onChange={(_event, newValue) => setActiveTab(newValue)}
                        aria-label="Left panel tabs"
                        sx={{
                          '& .MuiTab-root': {
                            minWidth: 'auto',
                            px: 2,
                            py: 2,
                          },
                        }}
                      >
                        <Tab
                          icon={<AccountTreeIcon />}
                          aria-label="pipeline"
                          title="Pipeline"
                        />
                        <Tab
                          icon={<FactoryIcon />}
                          aria-label="factories"
                          title="Factories"
                        />
                      </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
                      {activeTab === 0 && (
                        <>
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
                                onElementSelect={handleElementSelect}
                              />
                            </div>
                          )}
                        </>
                      )}
                      {activeTab === 1 && (
                        <FactoriesTreeView
                          treeManager={factoryTreeManagerRef.current}
                          selectedFactory={selectedFactory}
                          onFactorySelect={setSelectedFactory}
                        />
                      )}
                    </div>
                  </div>
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
                <Panel defaultSize={55} minSize={40}>
                  {pipelineLoaded && elementTreeManagerRef.current ? (
                    <PipelineGraph 
                      treeManager={elementTreeManagerRef.current} 
                      selectedElement={selectedElement}
                      onElementSelect={handleElementSelect}
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
                    {activeTab === 0 ? (
                      <ObjectDetails selectedElement={selectedElement} />
                    ) : (
                      <FactoryDetail selectedFactory={selectedFactory} />
                    )}
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
            <Panel defaultSize={5} minSize={5} maxSize={5}>
              <StatusBar status={composedStatus} />
            </Panel>
          </PanelGroup>
        </div>
      )}
    </div>
  );
}
