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
  GstObject,
  GObject,
  GstPad,
  GstGhostPad,
  GstPadDirection
} from '@/lib/gst';
import { ElementNode, GroupNode, InternalPadEdge } from '@/components';
import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = async (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  
  // Group nodes by parent to build hierarchy
  const nodesById = new Map(nodes.map(node => [node.id, node]));
  const rootNodes = nodes.filter(node => !node.parentId);
  const childNodesByParent = new Map<string, Node[]>();
  
  nodes.forEach(node => {
    if (node.parentId) {
      if (!childNodesByParent.has(node.parentId)) {
        childNodesByParent.set(node.parentId, []);
      }
      childNodesByParent.get(node.parentId)!.push(node);
    }
  });
  
  // Build ELK graph structure with support for hierarchical groups
  const buildElkNode = (node: Node): ElkNode => {
    const children = childNodesByParent.get(node.id) || [];
    const isGroup = children.length > 0;
    
    const elkNode: ElkNode = {
      id: node.id,
      // For groups, use minimum size; for elements, use standard size
      ...(isGroup ? {} : { width: nodeWidth, height: nodeHeight }),
      // For groups, add children and layout options
      ...(isGroup ? {
        children: children.map(child => buildElkNode(child)),
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': direction === 'LR' ? 'RIGHT' : 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '70',
          'elk.padding': '[top=100,left=50,bottom=50,right=50]', // Increased top padding for nested groups and headers
          'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
          'nodeSize.constraints': 'MINIMUM_SIZE',
          'nodeSize.minimum': '(200,120)',
        }
      } : {})
    };
    return elkNode;
  };
  
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction === 'LR' ? 'RIGHT' : 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '70',
      'elk.padding': '[top=50,left=50,bottom=50,right=50]',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    },
    children: rootNodes.map(node => buildElkNode(node)),
    edges: edges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    } as ElkExtendedEdge)),
  };
  
  const layoutedGraph = await elk.layout(graph);
  
  // Apply positions from ELK to React Flow nodes
  const applyPositions = (elkNode: ElkNode, parentPosition = { x: 0, y: 0 }) => {
    const node = nodesById.get(elkNode.id);
    if (node && elkNode.x !== undefined && elkNode.y !== undefined) {
      // For child nodes, positions are relative to parent
      // For root nodes, positions are absolute
      node.position = {
        x: node.parentId ? elkNode.x : elkNode.x + parentPosition.x,
        y: node.parentId ? elkNode.y : elkNode.y + parentPosition.y,
      };
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      
      // Apply calculated width and height from ELK
      if (elkNode.width !== undefined && elkNode.height !== undefined) {
        // Only set style if it's not overridden by React Flow's group handling
        node.style = {
          ...node.style,
          width: elkNode.width,
          height: elkNode.height,
        };
      }
      
      // If this node has children, process them recursively
      if (elkNode.children) {
        const absolutePosition = {
          x: (elkNode.x ?? 0) + parentPosition.x,
          y: (elkNode.y ?? 0) + parentPosition.y,
        };
        elkNode.children.forEach(child => applyPositions(child, absolutePosition));
      }
    }
  };
  
  if (layoutedGraph.children) {
    layoutedGraph.children.forEach(child => applyPositions(child));
  }
  
  return { nodes, edges };
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Define custom node types
const nodeTypes = {
  element: ElementNode,
  group: GroupNode, // Use custom GroupNode for groups that supports handles
};

// Define custom edge types
const edgeTypes = {
  ghostPad: InternalPadEdge, // Custom edge for internal pad connections
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
    const node: Node = {
      id: element.ptr,
      data: {
        label: elementName,
        element: element,
      },
      parentId: bin ? bin.ptr : undefined,
      type: isGstBin ? 'group' : 'element', // Use 'group' for bins so they work properly for containment
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
      
      for await (const obj of iterator) {
        const child: GstElement = await obj.castTo(GstElement);
        await generateNode(child, nodeArray, bin);
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
        
        for await (const obj of iterator) {
          const pad = await obj.castTo(GstPad);
          const padPtr = pad.ptr;
          
          // Skip if we've already processed this pad
          if (processedPads.has(padPtr)) {
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
              continue;
            }
            
            // Get the parent element of the peer pad
            const peerParent = await peerPad.get_parent();
            let peerObject = await peerParent.castTo(GstObject);
            let peerObjectPtr = peerObject.ptr;
            
            // Get names before potentially changing peerElement
            const elementName = await element.get_name();
            let peerObjectName = await peerObject.get_name();
            const padName = await pad.get_name();
            const peerPadName = await peerPad.get_name();
            
            // Initialize edge type as default
            let edgeType = 'default';
            
            // If the peer element is a ghost pad, use its parent (the bin) instead
            if (await peerObject.isOf(GstGhostPad)) {
              edgeType = 'ghostPad';
              const ghostPadParent = await peerObject.get_parent();
              peerObject = await ghostPadParent.castTo(GstElement);
              peerObjectPtr = peerObject.ptr;
              // Keep the original ghost pad name for handle ID generation
            }
            
            // Get pad directions to determine source/target
            const padDirection = await pad.get_direction();
            const peerDirection = await peerPad.get_direction();
            
            // Create edge based on pad directions
            // Source pads connect TO sink pads
            let sourceNodeId: string, targetNodeId: string;
            let sourceHandleId: string, targetHandleId: string;
            
            if (padDirection === GstPadDirection.SRC && peerDirection === GstPadDirection.SINK) {
              sourceNodeId = element.ptr;
              targetNodeId = peerObjectPtr;
              sourceHandleId = `${elementName}-${padName}`;
              targetHandleId = `${peerObjectName}-${peerPadName}`;
            } else if (padDirection === GstPadDirection.SINK && peerDirection === GstPadDirection.SRC) {
              sourceNodeId = peerObjectPtr;
              targetNodeId = element.ptr;
              sourceHandleId = `${peerObjectName}-${peerPadName}`;
              targetHandleId = `${elementName}-${padName}`;
            } else {
              // Skip invalid connections
              console.warn(`Invalid pad connection: ${padDirection} -> ${peerDirection}`);
              continue;
            }

            // Verify both nodes exist in our node array
            const sourceNode = nodeArray.find(n => n.id === sourceNodeId);
            const targetNode = nodeArray.find(n => n.id === targetNodeId);
            
            if (sourceNode && targetNode) {
              const edge: Edge = {
                id: `${sourceHandleId}:${targetHandleId}`,
                source: sourceNodeId,
                target: targetNodeId,
                sourceHandle: sourceHandleId,
                targetHandle: targetHandleId,
                type: edgeType, // Use custom type for ghost pads
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
            }
            
            // Mark both pads as processed
            processedPads.add(padPtr);
            processedPads.add(peerPadPtr);
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
      
      const pipeline = new GstPipeline(pipelinePtr, 'none');
      await generateNode(pipeline, nodeArray);
      
      // Generate edges between connected elements
      setStatus('Generating edges...');
      const edgeArray = await generateEdges(nodeArray);
      
      // Apply layout to collected nodes and edges
      const layouted = await getLayoutedElements(nodeArray, edgeArray);
      
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

      <div className="flex-1">
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
      </div>
    </div>
  );
}
