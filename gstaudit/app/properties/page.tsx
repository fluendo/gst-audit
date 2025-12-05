'use client';

import { useState } from 'react';
import { getConfig } from '@/lib/config';
import Link from 'next/link';
import {
  GObjectObject,
  GObjectValue,
  GstPipeline,
  GstBin,
  GstElement,
  GstObject,
  GObject,
  GstPad,
  GstGhostPad,
  GstPadDirection
} from '@/lib/gst';

export default function PropertiesPage() {
  const [status, setStatus] = useState<string>('Disconnected');
  const [pipelinePtr, setPipelinePtr] = useState<string | null>(null);
  const config = getConfig();

  const fetchPipelines = async () => {
    try {
      setStatus('Fetching pipelines...');
      const response = await fetch(`${config.gstauditBaseUrl}/GstAudit/pipelines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pipelines = await response.json();
      setStatus(`Found ${pipelines.length} pipeline(s)`);
      console.log('Pipelines:', pipelines);
      
      // Set the first pipeline pointer and generate nodes directly
      if (pipelines.length > 0) {
        setStatus('Loading pipeline structure...');
        setPipelinePtr(pipelines[0].ptr);
        await generateNodes(pipelines[0].ptr);
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateNodes = async (pipelinePtr: string) => {
    try {
      // Create array to collect nodes
      const nodeArray: Node[] = [];
      
      const pipeline = new GstPipeline(pipelinePtr, 'none');

      console.log(pipeline);
      console.log(GObject);
      pipeline.list_properties();
      // console.log(GObject.Object.interface_list_properties(pipeline));
      
      // pipeline.set_state(state);
      // await generateNode(pipeline, nodeArray);
    } catch (error) {
      console.error('Error in direct node generation:', error);
      setStatus(`Error loading pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pipeline Visualization</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{config.gstauditBaseUrl}</code>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchPipelines}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fetch Pipelines
            </button>
            {pipelinePtr && (
              <button
                onClick={() => generateNodes(pipelinePtr)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Reload Pipeline
              </button>
            )}
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <p className="mt-2 text-sm">Status: <span className="font-mono">{status}</span></p>
      </header>

      {/* <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={false}
          defaultViewport={{ x: 50, y: 50, zoom: 0.8 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div> */}
    </div>
  );
}