'use client';

import { useCallback, useState, useEffect } from 'react';
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
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { getConfig } from '@/lib/config';
import {
  GObjectObject,
  GObjectValue,
  GstPipeline,
  GstBin,
  GstElement,
  GObject,
  GstPad,
  GstIteratorResult,
  GstPadDirection
} from '@/lib/gst';
import { ElementNode } from '@/components';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Define custom node types
const nodeTypes = {
  element: ElementNode,
};

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

  // Function to apply layout to current nodes
  const applyLayout = useCallback((direction: 'LR' | 'TB' = 'LR') => {
    if (nodes.length > 0) {
      const layouted = getLayoutedElements(nodes, edges, direction);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
  }, [nodes, edges, setNodes, setEdges]);

  // Mock data generation for testing layout
  const generateMockNodes = () => {
    const mockNodes: Node[] = [
      {
        id: '1',
        data: { label: 'Source' },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: '2',
        data: { label: 'Filter' },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: '3',
        data: { label: 'Transform' },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: '4',
        data: { label: 'Sink' },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    ];

    const mockEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
    ];

    const layouted = getLayoutedElements(mockNodes, mockEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setStatus('Mock pipeline loaded with horizontal layout');
  };

  // Auto-apply layout when nodes are first loaded
  useEffect(() => {
    if (nodes.length > 0 && nodes.every(node => node.position.x === 0 && node.position.y === 0)) {
      // Only apply layout if all nodes are at origin (newly created)
      applyLayout('LR'); // Default to horizontal layout
    }
  }, [nodes.length]); // Only trigger when node count changes

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
  
  const createNode = async (element: GstElement, nodeArray: Node[], bin?: GstBin): Promise<void> => {
    const elementName: string = await element.get_name();
    const isGstBin = await element.isOf(GstBin);
    
    // Create ReactFlow node with GstElement in data
    console.error(`element found ${elementName} ${element.ptr}`);
    const node: Node = {
      id: element.ptr,
      data: {
        label: elementName,
        element: element
      },
      parentId: bin ? bin.ptr : undefined,
      type: isGstBin ? 'group' : 'element', // Use 'element' type for non-GstBin elements
      extent: bin ? 'parent' : undefined,
      expandParent: bin ? true : undefined,
      position: {
        x: 0, // Initial position, will be overridden by layout
        y: 0,
      }
    };
    nodeArray.push(node);
  }

  const generateNode = async (element: GstElement, nodeArray: Node[], parentElement?: GstBin) => {
    await createNode(element, nodeArray, parentElement);

    if (await element.isOf(GstBin)) {
      const bin = await element.castTo(GstBin);
      const iterator = await bin.iterate_elements();
      const value = await GObjectValue.new();
      await value.unset();
      let done = false;
      while (!done) {
        const res = await iterator.next(value);
        switch (res) {
          case GstIteratorResult.DONE:
            done = true;
            break;
          case GstIteratorResult.OK:
            // Check the type
            const obj: GObjectObject = await value.get_object();
            const child: GstElement = await obj.castTo(GstElement);
            await generateNode(child, nodeArray, bin);
            await value.unset();
            break;
          case GstIteratorResult.RESYNC:
            // Iterator was modified, resync and try again
            await iterator.resync();
            await value.unset();
            break;
          case GstIteratorResult.ERROR:
            console.error('Error iterating');
            done = true;
            break;
        }
      }
    }
  }

  // Generate edges between connected pads
  const generateEdges = async (nodeArray: Node[]): Promise<Edge[]> => {
    const edgeArray: Edge[] = [];
    const processedPads = new Set<string>(); // Track processed pads to avoid duplicates

    try {
      for (const node of nodeArray) {
        const element = node.data.element as GstElement;
        
        // Iterate through all pads of this element
        const iterator = await element.iterate_pads();
        const value = await GObjectValue.new();
        await value.unset();
        let done = false;
        
        while (!done) {
          const res = await iterator.next(value);
          switch (res) {
            case GstIteratorResult.DONE:
              done = true;
              break;
            case GstIteratorResult.OK:
              const obj: GObjectObject = await value.get_object();
              const pad = await obj.castTo(GstPad);
              const padPtr = pad.ptr;
              
              // Skip if we've already processed this pad
              if (processedPads.has(padPtr)) {
                await value.unset();
                continue;
              }
              
              // Check if pad is linked
              const isLinked = await pad.is_linked();
              if (isLinked) {
                // Get the peer pad
                const peerPad = await pad.get_peer();
                const peerPadPtr = peerPad.ptr;
                
                // Skip if we've already processed the peer pad
                if (processedPads.has(peerPadPtr)) {
                  await value.unset();
                  continue;
                }
                
                // Get the parent element of the peer pad
                const peerParent = await peerPad.get_parent();
                const peerElement = await peerParent.castTo(GstElement);
                const peerElementPtr = peerElement.ptr;
                
                // Get pad directions to determine source/target
                const padDirection = await pad.get_direction();
                const peerDirection = await peerPad.get_direction();
                
                // Create edge based on pad directions
                // Source pads connect TO sink pads
                let sourceNodeId: string, targetNodeId: string;
                let sourcePadName: string, targetPadName: string;
                
                if (padDirection === GstPadDirection.SRC && peerDirection === GstPadDirection.SINK) {
                  sourceNodeId = element.ptr;
                  targetNodeId = peerElementPtr;
                  sourcePadName = `${node.data.label}-${await pad.get_name()}`;
                  targetPadName = `${await peerElement.get_name()}-${await peerPad.get_name()}`;
                } else if (padDirection === GstPadDirection.SINK && peerDirection === GstPadDirection.SRC) {
                  sourceNodeId = peerElementPtr;
                  targetNodeId = element.ptr;
                  sourcePadName = `${await peerElement.get_name()}-${await peerPad.get_name()}`;
                  targetPadName = `${await node.data.label}-${await pad.get_name()}`;
                } else {
                  // Skip invalid connections
                  console.warn(`Invalid pad connection: ${padDirection} -> ${peerDirection}`);
                  await value.unset();
                  continue;
                }
                
                // Verify both nodes exist in our node array
                const sourceExists = nodeArray.some(n => n.id === sourceNodeId);
                const targetExists = nodeArray.some(n => n.id === targetNodeId);
                
                if (sourceExists && targetExists) {
                  const edge: Edge = {
                    id: `${sourceNodeId}-${sourcePadName}:${targetNodeId}-${targetPadName}`,
                    source: sourceNodeId,
                    target: targetNodeId,
                    sourceHandle: sourcePadName,
                    targetHandle: targetPadName,
                    label: `${sourcePadName} → ${targetPadName}`,
                    type: 'default',
                    animated: true,
                    style: {
                      stroke: '#0ea5e9',
                      strokeWidth: 2,
                    },
                    markerEnd: {
                      type: 'arrowclosed',
                      color: '#0ea5e9',
                    },
                  };
                  
                  edgeArray.push(edge);
                  console.log(`Created edge: ${sourcePadName} (${sourceNodeId}) -> ${targetPadName} (${targetNodeId})`);
                }
                
                // Mark both pads as processed
                processedPads.add(padPtr);
                processedPads.add(peerPadPtr);
              }
              
              await value.unset();
              break;
            case GstIteratorResult.RESYNC:
              await iterator.resync();
              await value.unset();
              break;
            case GstIteratorResult.ERROR:
              console.error('Error iterating pads');
              done = true;
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error generating edges:', error);
    }

    console.log(`Generated ${edgeArray.length} edges`);
    return edgeArray;
  };

  // Generate nodes directly by iterating over pipeline elements
  const generateNodes = async (pipelinePtr: string) => {
    try {
      // Create array to collect nodes
      const nodeArray: Node[] = [];
      
      const pipeline = new GstPipeline(pipelinePtr, true);
      await generateNode(pipeline, nodeArray);
      
      // Generate edges between connected elements
      setStatus('Generating edges...');
      const edgeArray = await generateEdges(nodeArray);
      
      // Apply layout to collected nodes and edges
      console.error('Nodes:', nodeArray);
      console.error('Edges:', edgeArray);
      const layouted = getLayoutedElements(nodeArray, edgeArray);
      
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      setStatus(`Pipeline successfully loaded with ${layouted.nodes.length} nodes and ${layouted.edges.length} edges`);
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
            <button
              onClick={generateMockNodes}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Demo Layout
            </button>
            {pipelinePtr && (
              <button
                onClick={() => generateNodes(pipelinePtr)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Reload Pipeline
              </button>
            )}
            <button
              onClick={() => applyLayout('LR')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              disabled={nodes.length === 0}
            >
              Horizontal Layout
            </button>
            <button
              onClick={() => applyLayout('TB')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={nodes.length === 0}
            >
              Vertical Layout
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
          nodeTypes={nodeTypes}
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
