'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../pipeline-theme.css';
import Link from 'next/link';
import { getConfig, getLayoutedElements, NodeTreeManager, NodeTree, ElementTreeManager } from '@/lib';
import type { PadConnectionInfo } from '@/components/types';
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
import { ElementNode, GroupNode, LinkEdge } from '@/components';



const detectSubpipelines = async (pipeline: GstPipeline | GstBin, parentName = ''): Promise<{ name: string; ptr: string }[]> => {
  const subpipelines: { name: string; ptr: string }[] = [];
  const iterator = await pipeline.iterate_elements();
  if (!iterator) return subpipelines;

  for await (const obj of iterator) {
    if (!obj) continue;
    const element = await obj.castTo(GstElement);

    if (await element.isOf(GstBin)) {
      const bin = await element.castTo(GstBin);
      const subpipelineName = await bin.get_name();
      const fullName = parentName ? `${parentName} > ${subpipelineName ?? 'unknown'}` : (subpipelineName ?? 'unknown');

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
  link: LinkEdge, // Custom edge for all pad connections
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
  
  // Initialize the element tree manager for testing
  const elementTreeManager = useRef(new ElementTreeManager()).current;
  
  // Track all edges (validated or not) - used for layout
  const [allEdges, setAllEdges] = useState<Edge[]>([]);
  
  // Track pending connections - key is connection ID, value tracks source/target validation
  const pendingConnections = useRef(new Map<string, {
    sourceReported: boolean;
    targetReported: boolean;
    connectionInfo: PadConnectionInfo;
  }>()).current;
  
  // Counter to force re-validation when connections change
  const [connectionVersion, setConnectionVersion] = useState(0);
  
  // Debounce validation to avoid multiple calls
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce layout to avoid multiple calls
  const layoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const config = getConfig();

  // Validate connections based on whether both source and target have reported
  const validateConnections = () => {
    const startTime = performance.now();
    console.log('[VALIDATION] Starting connection validation');
    const validatedEdges: Edge[] = [];
    
    // Check all edges and validate against pending connections
    allEdges.forEach((edge) => {
      const pending = pendingConnections.get(edge.id);
      
      if (pending && pending.sourceReported && pending.targetReported) {
        console.log(`[VALIDATION] Connection validated: ${edge.id}`);
        validatedEdges.push(edge);
      } else if (pending) {
        console.log(`[VALIDATION] Connection pending: ${edge.id} - source: ${pending.sourceReported}, target: ${pending.targetReported}`);
      }
    });
    
    console.log(`[VALIDATION] Validated ${validatedEdges.length} of ${allEdges.length} edges`);
    
    // Update the edges displayed in the chart
    setEdges(validatedEdges);
    
    const totalTime = performance.now() - startTime;
    console.log(`[TIMING] Total validateConnections took ${totalTime.toFixed(2)}ms`);
  };

  // Debounced validation - waits for all connection reports to complete
  const scheduleValidation = () => {
    // Clear any existing timeout
    unscheduleValidation();
    
    // Schedule new validation after delay
    validationTimeoutRef.current = setTimeout(() => {
      validateConnections();
    }, 200); // Wait for all connection reports to arrive
  };

  // Cancel any pending validation
  const unscheduleValidation = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
  };

  // Perform layout calculation and update nodes
  const layout = async () => {
    const startTime = performance.now();
    console.log('[LAYOUT] Starting layout calculation');
    const nodeTree = nodeTreeManager.getTree();
    if (!nodeTree) return;

    try {
      // Use validated edges for layout (only edges with both nodes present)
      const layoutStart = performance.now();
      await getLayoutedElements(nodeTree, edges);
      const layoutEnd = performance.now();
      console.log(`[TIMING] getLayoutedElements took ${(layoutEnd - layoutStart).toFixed(2)}ms`);
      
      // Extract all nodes from the tree structure after layout
      const extractStart = performance.now();
      const layoutedNodes = nodeTreeManager.getAllNodes();
      setNodes(layoutedNodes);
      const extractEnd = performance.now();
      console.log(`[TIMING] getAllNodes + setNodes took ${(extractEnd - extractStart).toFixed(2)}ms`);
      
      const totalTime = performance.now() - startTime;
      console.log(`[TIMING] Total layout took ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error during layout:', error);
    }
  };

  // Debounced layout - waits for all changes to complete
  const scheduleLayout = () => {
    // Clear any existing timeout
    unscheduleLayout();
    
    // Schedule layout after delay
    layoutTimeoutRef.current = setTimeout(() => {
      layout();
    }, 200); // Wait for all changes to settle
  };

  // Cancel any pending layout
  const unscheduleLayout = () => {
    if (layoutTimeoutRef.current) {
      clearTimeout(layoutTimeoutRef.current);
    }
  };

  // Auto-layout when tree changes or validated edges change
  useEffect(() => {
    scheduleLayout();
    // Cleanup timeout on unmount
    return unscheduleLayout;
  }, [treeVersion, edges]);

  // Validate connections when pending connections change
  useEffect(() => {
    if (connectionVersion > 0) {
      scheduleValidation();
    }
    // Cleanup timeout on unmount
    return unscheduleValidation;
  }, [connectionVersion]);

  // Update status when nodes, allEdges, or edges change
  useEffect(() => {
    setStatus(`Pipeline: ${nodes.length} nodes, ${allEdges.length} edges (${edges.length} validated)`);
  }, [nodes.length, allEdges.length, edges.length]);

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
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Implementation functions (decoupled from callbacks)
  
  const handlePadAdded = async (elementId: string, element: GstElement, pad: GstPad) => {
    const startTime = performance.now();
    try {
      const nameStart = performance.now();
      const elementName = await element.get_name();
      const nameEnd = performance.now();
      console.log(`[TIMING] get_name() took ${(nameEnd - nameStart).toFixed(2)}ms for element ${elementId}`);
      
      const padNameStart = performance.now();
      const padName = await pad.get_name();
      const padNameEnd = performance.now();
      console.log(`[TIMING] pad.get_name() took ${(padNameEnd - padNameStart).toFixed(2)}ms`);
      
      const handleId = `${elementName}-${padName}`;
      
      console.log(`[PAD_ADDED] pad "${padName}" on element "${elementName}" (${elementId})`);
      
      // Add handle to the NodeTree
      const addHandleStart = performance.now();
      nodeTreeManager.addHandleToNode(elementId, handleId);
      const addHandleEnd = performance.now();
      console.log(`[TIMING] addHandleToNode took ${(addHandleEnd - addHandleStart).toFixed(2)}ms`);
      
      const totalTime = performance.now() - startTime;
      console.log(`[TIMING] Total handlePadAdded took ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error handling pad addition:', error);
    }
  };

  const handlePadRemoved = async (elementId: string, element: GstElement, pad: GstPad) => {
    const startTime = performance.now();
    try {
      const elementName = await element.get_name();
      const padName = await pad.get_name();
      const handleId = `${elementName}-${padName}`;
      
      console.log(`[PAD_REMOVED] pad "${padName}" from element "${elementName}" (${elementId})`);
      
      // Remove handle from the NodeTree (for tracking purposes, not for validation)
      nodeTreeManager.removeHandleFromNode(elementId, handleId);
      
      const totalTime = performance.now() - startTime;
      console.log(`[TIMING] Total handlePadRemoved took ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error handling pad removal:', error);
    }
  };

  const handleConnectionAdded = (connection: PadConnectionInfo) => {
    const startTime = performance.now();
    console.log('[CONNECTION_ADDED] Connection reported:', connection, 'by:', connection.reportedBy);
    
    // Create a unique connection ID based on source and target
    const connectionId = `${connection.sourceHandleId}-${connection.targetHandleId}`;
    
    // Always use 'link' edge type with connection data
    const newEdge: Edge = {
      id: connectionId,
      source: connection.sourceNodeId,
      target: connection.targetNodeId,
      sourceHandle: connection.sourceHandleId,
      targetHandle: connection.targetHandleId,
      type: 'link',
      animated: false,
      data: connection as unknown as Record<string, unknown>, // Pass full connection info to LinkEdge
    };
    
    // Add to allEdges if not already there (for layout)
    setAllEdges((currentEdges) => {
      const exists = currentEdges.some(e => e.id === connectionId);
      if (!exists) {
        console.log('Adding edge to allEdges:', connectionId);
        return [...currentEdges, newEdge];
      }
      return currentEdges;
    });
    
    // Get or create the pending connection entry
    const pending = pendingConnections.get(connectionId) || {
      sourceReported: false,
      targetReported: false,
      connectionInfo: connection
    };
    
    // Update the reported status based on which pad reported
    if (connection.reportedBy === 'source') {
      pending.sourceReported = true;
    } else if (connection.reportedBy === 'target') {
      pending.targetReported = true;
    }
    
    // Store the updated pending connection
    pendingConnections.set(connectionId, pending);
    
    console.log('[CONNECTION_STATUS]', connectionId, 
      'source:', pending.sourceReported, 'target:', pending.targetReported);
    
    // Trigger validation
    setConnectionVersion(prev => prev + 1);
    
    const totalTime = performance.now() - startTime;
    console.log(`[TIMING] Total handleConnectionAdded took ${totalTime.toFixed(2)}ms`);
  };

  const handleConnectionRemoved = (connection: PadConnectionInfo) => {
    const startTime = performance.now();
    console.log('[CONNECTION_REMOVED] Connection removal reported:', connection, 'by:', connection.reportedBy);
    
    const connectionId = `${connection.sourceHandleId}-${connection.targetHandleId}`;
    
    // Check if this connection exists in pending
    const pending = pendingConnections.get(connectionId);
    if (pending) {
      // Update the reported status - mark as removed
      if (connection.reportedBy === 'source') {
        pending.sourceReported = false;
      } else if (connection.reportedBy === 'target') {
        pending.targetReported = false;
      }
      
      // If neither side reports the connection anymore, remove completely
      if (!pending.sourceReported && !pending.targetReported) {
        pendingConnections.delete(connectionId);
        console.log('Connection removed from pending:', connectionId);
        
        // Remove from allEdges
        setAllEdges((currentEdges) => {
          const filtered = currentEdges.filter(e => e.id !== connectionId);
          if (filtered.length < currentEdges.length) {
            console.log('Edge removed from allEdges:', connectionId);
          }
          return filtered;
        });
      } else {
        // Update the pending connection state
        pendingConnections.set(connectionId, pending);
      }
      
      // Trigger validation to update displayed edges
      setConnectionVersion(prev => prev + 1);
    }
    
    const totalTime = performance.now() - startTime;
    console.log(`[TIMING] Total handleConnectionRemoved took ${totalTime.toFixed(2)}ms`);
  };

  const handleElementRemoved = async (parentId: string, parentBin: GstBin, element: GstElement) => {
    const startTime = performance.now();
    console.log('[ELEMENT_REMOVED] Element removed from parent', parentId);
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

      // Remove the element and all its descendants from nodes
      setNodes((prevNodes) => {
        const idsToRemove = getDescendantIds(prevNodes, element.ptr);
        return prevNodes.filter(node => !idsToRemove.includes(node.id));
      });

      // Remove the node from the tree structure as well
      if (nodeTreeManager.removeNodeFromTree(element.ptr)) {
        setTreeVersion(prev => prev + 1);
      }
      
      const totalTime = performance.now() - startTime;
      console.log(`[TIMING] Total handleElementRemoved took ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error handling element removal:', error);
    }
  };

  const handleElementAdded = async (parentId: string, parentBin: GstBin, element: GstElement) => {
    const startTime = performance.now();
    try {
      const nameStart = performance.now();
      const elementName = (await element.get_name()) ?? 'unknown';
      const nameEnd = performance.now();
      console.log(`[TIMING] element.get_name() took ${(nameEnd - nameStart).toFixed(2)}ms for new element`);
      
      console.log('[ELEMENT_ADDED] Element added:', elementName, 'to parent', parentId);
      
      const isBinStart = performance.now();
      const isGstBin = await element.isOf(GstBin);
      const isBinEnd = performance.now();
      console.log(`[TIMING] isOf(GstBin) took ${(isBinEnd - isBinStart).toFixed(2)}ms`);

      // Create a new node
      const newNode: Node = {
        id: element.ptr,
        data: isGstBin ? {
          bin: await element.castTo(GstBin),
          onElementAdded: onElementAdded,
          onElementRemoved: onElementRemoved,
          onPadAdded: onPadAdded,
          onPadRemoved: onPadRemoved,
          onConnectionAdded: onConnectionAdded,
          onConnectionRemoved: onConnectionRemoved,
        } : {
          element: element,
          onPadAdded: onPadAdded,
          onPadRemoved: onPadRemoved,
          onConnectionAdded: onConnectionAdded,
          onConnectionRemoved: onConnectionRemoved,
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

      // Add the new node to the state
      setNodes((prevNodes) => [...prevNodes, newNode]);
      // Update tree hierarchy
      if (nodeTreeManager.addNodeToTree(parentId, newNode)) {
        setTreeVersion(prev => prev + 1);
      }
      
      const totalTime = performance.now() - startTime;
      console.log(`[TIMING] Total handleElementAdded took ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error handling element added:', error);
    }
  };

  // Callback handlers (lightweight wrappers that call implementation functions)

  // Callback function to handle pad addition
  const onPadAdded = useCallback(async (elementId: string, element: GstElement, pad: GstPad) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onPadAdded called for element', elementId);
    await handlePadAdded(elementId, element, pad);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onPadAdded callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
  }, []);

  // Callback function to handle pad removal
  const onPadRemoved = useCallback(async (elementId: string, element: GstElement, pad: GstPad) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onPadRemoved called for element', elementId);
    await handlePadRemoved(elementId, element, pad);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onPadRemoved callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
  }, []);

  // Callback function to handle connection addition
  const onConnectionAdded = useCallback((connection: PadConnectionInfo) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onConnectionAdded called');
    handleConnectionAdded(connection);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onConnectionAdded callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
  }, []);

  // Callback function to handle connection removal
  const onConnectionRemoved = useCallback((connection: PadConnectionInfo) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onConnectionRemoved called');
    handleConnectionRemoved(connection);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onConnectionRemoved callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
  }, []);

  // Callback function to handle element removal
  const onElementRemoved = useCallback(async (parentId: string, parentBin: GstBin, element: GstElement) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onElementRemoved called');
    await handleElementRemoved(parentId, parentBin, element);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onElementRemoved callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
  }, []);

  // Callback function to handle element addition
  const onElementAdded = useCallback(async (parentId: string, parentBin: GstBin, element: GstElement) => {
    const callbackStart = performance.now();
    console.log('[CALLBACK] onElementAdded called');
    await handleElementAdded(parentId, parentBin, element);
    const callbackEnd = performance.now();
    console.log(`[TIMING] onElementAdded callback total: ${(callbackEnd - callbackStart).toFixed(2)}ms`);
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
          onConnectionAdded: onConnectionAdded,
          onConnectionRemoved: onConnectionRemoved,
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

  // Test function to measure ElementTreeManager performance
  const testElementTreeGeneration = async () => {
    if (!selectedPipeline) {
      alert('No pipeline selected!');
      return;
    }

    try {
      setStatus('Testing ElementTreeManager performance...');
      console.log('========================================');
      console.log('[TEST] Starting ElementTreeManager test');
      console.log('========================================');
      
      const testStart = performance.now();
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      
      // Generate the tree
      await elementTreeManager.generateTree(pipeline);
      
      const testEnd = performance.now();
      const totalTime = (testEnd - testStart).toFixed(2);
      
      // Get the generated tree to count elements and pads
      const tree = elementTreeManager.getRoot();
      if (tree) {
        const countElements = (node: any): number => {
          let count = 1;
          for (const child of node.children) {
            count += countElements(child);
          }
          return count;
        };
        
        const countPads = (node: any): number => {
          let count = node.pads.length;
          for (const child of node.children) {
            count += countPads(child);
          }
          return count;
        };
        
        const elementCount = countElements(tree);
        const padCount = countPads(tree);
        
        console.log('========================================');
        console.log(`[TEST] ElementTreeManager Results:`);
        console.log(`[TEST] - Total time: ${totalTime}ms`);
        console.log(`[TEST] - Elements discovered: ${elementCount}`);
        console.log(`[TEST] - Pads discovered: ${padCount}`);
        console.log('========================================');
        
        setStatus(`ElementTreeManager: ${totalTime}ms - ${elementCount} elements, ${padCount} pads`);
      } else {
        setStatus('ElementTreeManager: No tree generated');
      }
    } catch (error) {
      console.error('[TEST] Error testing ElementTreeManager:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                  onClick={testElementTreeGeneration}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Test Tree Generation
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
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={false}
          defaultViewport={{ x: 50, y: 50, zoom: 0.8 }}
          minZoom={0.1}
          maxZoom={2}
          panOnScroll={true}
          selectionOnDrag={true}
          panOnDrag={false}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
