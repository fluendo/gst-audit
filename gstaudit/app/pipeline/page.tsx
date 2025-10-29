'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { getConfig } from '@/lib/config';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function PipelinePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [status, setStatus] = useState<string>('Disconnected');
  const [pipelinePtr, setPipelinePtr] = useState<string | null>(null);
  const config = getConfig();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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
        await generateNodesDirectly(pipelines[0].ptr);
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const generateNode = async (element: GstElement): Node => {
    const elementName = await element.get_name();
    // Create ReactFlow node with GstElement in data
    const node: Node = {
      id: element.ptr,
      data: {
        label: elementName,
        element: element // Store the actual GstElement object
      },
      position: {
        x: 100,
        y: 100,
      }
    };
    return node;
  }

  // Generate nodes directly by iterating over pipeline elements
  const generateNodesDirectly = async (pipelinePtr: string) => {
    try {
      const gstModule = await import('@/lib/gst');
      const { GObjectValue, GstPipeline, GstElement, GObject } = gstModule;
      const pipeline = new GstPipeline(pipelinePtr, true);
      await pipeline.ref();
      const iterator = await pipeline.iterate_elements();
      
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Get pipeline name for status
      const pipelineName = await pipeline.get_name();
      
      // Iterate over elements and create nodes
      const value = await GObjectValue.new();
      await value.unset();
      let done = false;
      while (!done) {
        const res = await iterator.next(value);
	console.error(`res = ${res}`);
        switch (res) {
            case 1:
              // Check the type
	      const obj = await value.get_object();
	      /*const element_type = await GstElement.get_type();
	      const is_element = await GObject.type_check_instance_is_a(obj, element_type);*/
	      const element = await obj.castTo(GstElement);
	      console.error(`element name ${await element.get_name()}`);
	      const node = await generateNode(element);
              nodes.push(node);
              await value.unset();
              break;
            case 0:
	      done = true;
              break;
        }
      }
      setNodes(nodes);
      setEdges(edges);
      setStatus(`Successfully loaded ${nodes.length} elements from pipeline: ${pipelineName}`);
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
                onClick={() => generateNodesDirectly(pipelinePtr)}
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

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
