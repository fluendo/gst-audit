'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
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
import { getConfig, getLayoutedElements, NodeTreeManager, NodeTree } from '@/lib';
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
  GstPadDirection,
  GstState,
  GstStateValue
} from '@/lib/gst';
import { ElementNode, GroupNode, InternalPadEdge } from '@/components';



const detectSubpipelines = async (pipeline: GstPipeline | GstBin, parentName = ''): Promise<{ name: string; ptr: string }[]> => {
  const subpipelines: { name: string; ptr: string }[] = [];
  const iterator = await pipeline.iterate_elements();

  for await (const obj of iterator) {
    const element = await obj.castTo(GstElement);

    if (await element.isOf(GstBin)) {
      const bin = await element.castTo(GstBin);
      const subpipelineName = await bin.get_name();
      const fullName = parentName ? `${parentName} > ${subpipelineName}` : subpipelineName;

      // Add the current subpipeline
      subpipelines.push({ name: fullName, ptr: bin.ptr });

      // Recursively detect subpipelines within this bin
      const nestedSubpipelines = await detectSubpipelines(bin, fullName);
      subpipelines.push(...nestedSubpipelines);
    }
  }

  return subpipelines;
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
  const [pipelines, setPipelines] = useState<{ name: string; ptr: string }[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [treeVersion, setTreeVersion] = useState(0); // Track tree changes
  
  // Initialize the node tree manager
  const nodeTreeManager = useRef(new NodeTreeManager()).current;
  
  const config = getConfig();

  // Auto-layout when tree changes
  useEffect(() => {
    const nodeTree = nodeTreeManager.getTree();
    if (nodeTree) {
      const relayout = async () => {
        try {
          await getLayoutedElements(nodeTree);
          
          // Extract all nodes from the tree structure after layout
          const layoutedNodes = nodeTreeManager.getAllNodes();
          setNodes(layoutedNodes);
        } catch (error) {
          console.error('Error during layout:', error);
        }
      };
      relayout();
    }
  }, [treeVersion]);

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
      const pipelinesData = await response.json();

      const allPipelines: { name: string; ptr: string }[] = [];

      for (const pipeline of pipelinesData) {
        const gstPipeline = new GstPipeline(pipeline.ptr, 'none');
        const pipelineName = pipeline.name;

        // Add the top-level pipeline
        allPipelines.push({ name: pipelineName, ptr: gstPipeline.ptr });

        // Detect subpipelines recursively
        const subpipelines = await detectSubpipelines(gstPipeline, pipelineName);
        allPipelines.push(...subpipelines);
      }

      setPipelines(allPipelines);
      setStatus(`Found ${allPipelines.length} pipeline(s)`);
      console.log('Pipelines:', allPipelines);
      if (allPipelines.length > 0) {
        setSelectedPipeline(allPipelines[0].ptr); // Default to the first pipeline
        setStatus(`Pipeline "${allPipelines[0].name}" selected`);
        await generateNodes(allPipelines[0].ptr);
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Callback function to handle pad addition
  const onPadAdded = useCallback(async (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => {
    try {
      const elementName = await element.get_name();
      const padName = await pad.get_name();
      const handleId = `${elementName}-${padName}`;
      
      console.log(`Pad added: ${type} pad "${padName}" on element "${elementName}" (${elementId})`);
      
      // Add handle to the NodeTree
      nodeTreeManager.addHandleToNode(elementId, handleId);
    } catch (error) {
      console.error('Error handling pad addition:', error);
    }
  }, []);

  // Callback function to handle pad removal
  const onPadRemoved = useCallback(async (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => {
    try {
      const elementName = await element.get_name();
      const padName = await pad.get_name();
      const handleId = `${elementName}-${padName}`;
      
      console.log(`Pad removed: ${type} pad "${padName}" from element "${elementName}" (${elementId})`);
      
      // Remove handle from the NodeTree
      nodeTreeManager.removeHandleFromNode(elementId, handleId);
    } catch (error) {
      console.error('Error handling pad removal:', error);
    }
  }, []);

  // Callback function to handle element removal
  const onElementRemoved = useCallback(async (parentId: string, parentBin: GstBin, element: GstElement) => {
    try {
      // Helper function to get all descendant node IDs recursively
      const getDescendantIds = (nodes: Node[], nodeId: string): string[] => {
        const descendants: string[] = [nodeId];
        const children = nodes.filter(node => node.parentId === nodeId);
        
        children.forEach(child => {
          descendants.push(...getDescendantIds(nodes, child.id));
        });
        
        return descendants;
      };

      setStatus(`Pipeline successfully loaded with ${nodes.length} nodes and ${edges.length} edges`);
      // Remove the element and all its descendants from nodes
      setNodes((prevNodes) => {
        const idsToRemove = getDescendantIds(prevNodes, element.ptr);
        return prevNodes.filter(node => !idsToRemove.includes(node.id));
      });

      // Remove the node from the tree structure as well
      if (nodeTreeManager.removeNodeFromTree(element.ptr)) {
        setTreeVersion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling element removal:', error);
    }
  }, []);

  // Callback function to handle element addition
  const onElementAdded = useCallback(async (parentId: string, parentBin: GstBin, element: GstElement) => {
    try {
      const elementName: string = await element.get_name();
      const isGstBin = await element.isOf(GstBin);

      // Create a new node
      const newNode: Node = {
        id: element.ptr,
        data: isGstBin ? {
          bin: await element.castTo(GstBin),
          onElementAdded: onElementAdded,
          onElementRemoved: onElementRemoved,
          onPadAdded: onPadAdded,
          onPadRemoved: onPadRemoved,
        } : {
          element: element,
          onPadAdded: onPadAdded,
          onPadRemoved: onPadRemoved,
        },
        parentId: parentId,
        type: isGstBin ? 'group' : 'element',
        extent: 'parent' as const,
        expandParent: true,
        position: {
          x: Math.random() * 200,
          y: Math.random() * 200,
        },
        // Initial size, will be overridden by layout. This is important to avoid a continuos resizing loop
        ...(isGstBin && {
          style: {
            width: 300,
            height: 200,
            minWidth: 250,
            minHeight: 150,
          }
        }),
      };

      setStatus(`Pipeline successfully loaded with ${nodes.length} nodes and ${edges.length} edges`);
      // Add the new node to the state
      setNodes((prevNodes) => [...prevNodes, newNode]);
      // Update tree hierarchy
      if (nodeTreeManager.addNodeToTree(parentId, newNode)) {
        setTreeVersion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error handling element added:', error);
    }
  }, []);

  // Generate nodes directly by iterating over pipeline elements
  const generateNodes = async (selectedPipeline: string) => {
    try {
      // Create array to collect nodes
      const nodeArray: Node[] = [];

      const pipeline = new GstPipeline(selectedPipeline, 'none');
      const pipelineName = await pipeline.get_name();
      
      const pipelineNode: Node = {
        id: pipeline.ptr,
        data: {
          bin: pipeline,
          onElementAdded: onElementAdded,
          onElementRemoved: onElementRemoved,
          onPadAdded: onPadAdded,
          onPadRemoved: onPadRemoved,
        },
        type: 'group',
        position: {
          x: 100,
          y: 100,
        },
        style: {
          width: 400,
          height: 300,
          minWidth: 350,
          minHeight: 250,
        }
      };
      
      setNodes([pipelineNode]);
      
      // Initialize the node tree with the pipeline as root
      nodeTreeManager.initializeTree(pipelineNode);
      setTreeVersion(prev => prev + 1);
    } catch (error) {
      console.error('Error in direct node generation:', error);
      setStatus(`Error loading pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const setPipelineState = async (state: GstStateValue) => {
    if (!selectedPipeline) {
      alert('No pipeline selected!');
      return;
    }

    try {
      const stateName = state === GstState.PLAYING ? 'PLAYING' : 'PAUSED';
      setStatus(`Setting state to ${stateName}...`);
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      await pipeline.set_state(state);

      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: state === GstState.PLAYING, // Enable animation for PLAYING, disable for PAUSED
        })),
      );

      setStatus(`State set to ${stateName}`);
    } catch (error) {
      console.error('Error setting pipeline state:', error);
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
            {pipelines.length > 0 && (
              <select
                value={selectedPipeline || ''}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {pipelines.map((pipeline) => (
                  <option key={pipeline.ptr} value={pipeline.ptr}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            )}
            {selectedPipeline && (
              <>
                <button
                  onClick={() => generateNodes(selectedPipeline)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Load Pipeline
                </button>
                <button
                  onClick={() => setPipelineState(GstState.PLAYING)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Play
                </button>
                <button
                  onClick={() => setPipelineState(GstState.PAUSED)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Pause
                </button>
              </>
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
