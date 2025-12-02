import React, { memo, useMemo, useEffect } from 'react';
import { 
  ReactFlow,
  Node, 
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ElementTreeManager, ElementTree, getTheme, getLayoutedElements } from '@/lib';
import { GstPadDirection } from '@/lib/gst';
import ElementNode from './ElementNode';
import GroupNode from './GroupNode';
import LinkEdge from './LinkEdge';

// Define custom node types
const nodeTypes = {
  element: ElementNode,
  group: GroupNode,
};

// Define custom edge types
const edgeTypes = {
  link: LinkEdge,
};

interface PipelineGraphProps {
  treeManager: ElementTreeManager;
  selectedElement?: ElementTree | null;
}

/**
 * PipelineGraph component that renders a GStreamer pipeline as a React Flow graph
 * Converts ElementTree to React Flow format and displays them
 */
const PipelineGraphInner: React.FC<PipelineGraphProps> = ({ treeManager, selectedElement }) => {
  const theme = getTheme();
  const { fitView } = useReactFlow();
  
  // Convert ElementTree to React Flow nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    console.log('[PIPELINE_GRAPH] Converting ElementTree to React Flow format...');
    const startTime = performance.now();
    
    const flatTree = treeManager.getFlatTree();
    const nodes = flatTree.map(tree => convertToNode(tree));
    const edges = discoverEdges(flatTree);
    
    const totalTime = performance.now() - startTime;
    console.log(`[PIPELINE_GRAPH] Generated ${nodes.length} nodes and ${edges.length} edges in ${totalTime.toFixed(2)}ms`);
    
    return { initialNodes: nodes, initialEdges: edges };
  }, [treeManager, theme]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Apply layout when nodes/edges change
  useEffect(() => {
    const applyLayout = async () => {
      if (initialNodes.length === 0) return;
      
      console.log('[PIPELINE_GRAPH] Applying layout...');
      const layoutStart = performance.now();
      
      const layoutedNodes = await getLayoutedElements(initialNodes, initialEdges, 'LR');
      
      const layoutEnd = performance.now();
      console.log(`[PIPELINE_GRAPH] Layout applied in ${(layoutEnd - layoutStart).toFixed(2)}ms`);
      
      setNodes(layoutedNodes);
      setEdges(initialEdges);
    };
    
    applyLayout();
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  // Center on selected element when it changes
  useEffect(() => {
    if (selectedElement && nodes.length > 0) {
      const node = nodes.find(n => n.id === selectedElement.id);
      if (node) {
        fitView({
          nodes: [node],
          duration: 500,
          padding: 0.5,
        });
      }
    }
  }, [selectedElement, nodes, fitView]);
  
  return (
    <div className="w-full h-full">
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
  );
};

/**
 * Convert ElementTree to a React Flow node (stores ElementTree in data)
 */
function convertToNode(tree: ElementTree): Node {
  const isGroup = tree.children.length > 0;
  const theme = getTheme();
  
  return {
    id: tree.id,
    type: isGroup ? 'group' : 'element',
    parentId: tree.parent?.id,
    position: { x: 0, y: 0 }, // Will be set by layout
    data: tree as any, // Store the entire ElementTree
    ...(isGroup && {
      extent: 'parent' as const,
      expandParent: true,
      style: {
        width: theme.node.groupMinWidth,
        height: theme.node.groupMinHeight,
        minWidth: theme.node.groupMinWidth,
        minHeight: theme.node.groupMinHeight,
      }
    })
  };
}

/**
 * Discover edges from pad linkedTo references
 */
function discoverEdges(elementTrees: ElementTree[]): Edge[] {
  const edges: Edge[] = [];
  const processedConnections = new Set<string>();
  
  // Build a map of pad ptr -> pad info for quick lookup
  // Include both regular pads and internal pads from ghost pads
  const padMap = new Map<string, { tree: ElementTree; pad: any }>();
  elementTrees.forEach(tree => {
    tree.pads.forEach(pad => {
      padMap.set(pad.id, { tree, pad });
      
      // Also add internal pad if it exists
      if (pad.internal) {
        padMap.set(pad.internal.id, { tree, pad: pad.internal });
      }
    });
  });
  
  // Helper function to check edges for a pad
  const checkPadConnections = (tree: ElementTree, pad: any) => {
    if (!pad.linkedTo) return;
    
    // Find the peer pad info
    const peerInfo = padMap.get(pad.linkedTo.ptr);
    if (!peerInfo) return;
    
    const peerPad = peerInfo.pad;
    
    // Determine source and target based on direction
    const isSrc = pad.direction === GstPadDirection.SRC;
    const sourceElementId = isSrc ? tree.id : peerInfo.tree.id;
    const targetElementId = isSrc ? peerInfo.tree.id : tree.id;
    const sourceHandle = isSrc ? pad.representation : peerPad.representation;
    const targetHandle = isSrc ? peerPad.representation : pad.representation;
    
    // Create connection ID (always source->target order to avoid duplicates)
    const connectionId = `${sourceHandle}-${targetHandle}`;
    
    // Skip if already processed (since both pads will report the connection)
    if (processedConnections.has(connectionId)) return;
    processedConnections.add(connectionId);
    
    edges.push({
      id: connectionId,
      source: sourceElementId,
      target: targetElementId,
      sourceHandle,
      targetHandle,
      type: 'link',
      animated: false,
      data: {
        isInternal: pad.isInternal || peerPad.isInternal
      }
    });
  };
  
  // For each element, check each pad's linkedTo (including internal pads)
  for (const tree of elementTrees) {
    for (const pad of tree.pads) {
      // Check the pad itself
      checkPadConnections(tree, pad);
      
      // Check internal pad if it exists
      if (pad.internal) {
        checkPadConnections(tree, pad.internal);
      }
    }
  }
  
  return edges;
}

// Wrapper component with ReactFlowProvider
export const PipelineGraph: React.FC<PipelineGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <PipelineGraphInner {...props} />
    </ReactFlowProvider>
  );
};

export default memo(PipelineGraph);
