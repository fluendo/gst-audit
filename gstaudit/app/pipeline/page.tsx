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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'videotestsrc' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'videoconvert' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'fakesink' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function PipelinePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [status, setStatus] = useState<string>('Disconnected');
  const config = getConfig();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const fetchPipelines = async () => {
    try {
      setStatus('Fetching pipelines...');
      const response = await fetch(`${config.baseUrl}/gstaudit/GstAudit/pipelines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pipelines = await response.json();
      setStatus(`Found ${pipelines.length} pipeline(s)`);
      console.log('Pipelines:', pipelines);
      // TODO: Convert pipeline data to nodes/edges
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pipeline Visualization</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{config.baseUrl}</code>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchPipelines}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fetch Pipelines
            </button>
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
