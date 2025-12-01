import { Position, Edge, Node } from '@xyflow/react';
import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import { ElementTree } from './ElementTreeManager';
import { getTheme } from './theme';

const elk = new ELK();

export const getLayoutedElements = async (nodes: Node[], edges: Edge[] = [], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  const theme = getTheme();

  // Build hierarchy map
  const nodeMap = new Map<string, Node>();
  const childrenMap = new Map<string, Node[]>();
  
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  // Build ELK graph structure from nodes
  const buildElkNode = (node: Node): ElkNode => {
    const tree = node.data as unknown as ElementTree;
    const children = childrenMap.get(node.id) || [];
    const isGroup = children.length > 0;

    // For element nodes, use the actual height if it's been set (from pad calculations)
    // Otherwise fall back to theme minimum height
    const elementHeight = !isGroup && node.style?.height 
      ? (typeof node.style.height === 'number' 
          ? node.style.height 
          : parseFloat(node.style.height as string))
      : theme.node.elementMinHeight;

    const elkNode: ElkNode = {
      id: node.id,
      // For groups, use minimum size; for elements, use actual or standard size
      ...(isGroup ? {} : { 
        width: theme.node.elementWidth, 
        height: elementHeight 
      }),
      // For groups, add children and layout options
      ...(isGroup ? {
        children: children.map(child => buildElkNode(child)),
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': direction === 'LR' ? 'RIGHT' : 'DOWN',
          'elk.spacing.nodeNode': `${theme.layout.nodeSpacing}`,
          'elk.layered.spacing.nodeNodeBetweenLayers': `${theme.layout.layerSpacing}`,
          'elk.padding': `[top=${theme.layout.groupPaddingTop},left=${theme.layout.groupPaddingLeft},bottom=${theme.layout.groupPaddingBottom},right=${theme.layout.groupPaddingRight}]`,
          'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
          'nodeSize.constraints': 'MINIMUM_SIZE',
          'nodeSize.minimum': `(${theme.node.groupMinWidth},${theme.node.groupMinHeight})`,
        }
      } : {})
    };
    return elkNode;
  };

  // Find root nodes (nodes without parents)
  const rootNodes = nodes.filter(n => !n.parentId);
  
  if (rootNodes.length === 0) {
    throw new Error('No root nodes found');
  }
  
  if (rootNodes.length > 1) {
    throw new Error('Multiple root nodes found - expected single root');
  }
  
  const elkGraph: ElkNode = buildElkNode(rootNodes[0]);
  
  // Add edges to the ELK graph
  const elkEdges: ElkExtendedEdge[] = edges.map(edge => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));
  
  elkGraph.edges = elkEdges;
  
  const layoutedGraph = await elk.layout(elkGraph);

  // Apply positions from ELK back to React Flow nodes
  const applyPositions = (elkNode: ElkNode, parentPosition = { x: 0, y: 0 }) => {
    const node = nodeMap.get(elkNode.id);
    if (!node) return;
    
    if (elkNode.x !== undefined && elkNode.y !== undefined) {
      node.position = {
        x: node.parentId ? elkNode.x : elkNode.x + parentPosition.x,
        y: node.parentId ? elkNode.y : elkNode.y + parentPosition.y,
      };
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      
      // Apply calculated width and height from ELK
      if (elkNode.width !== undefined && elkNode.height !== undefined) {
        node.style = {
          ...node.style,
          width: elkNode.width,
          height: elkNode.height,
        };
      }

      // Process children recursively
      if (elkNode.children) {
        const absolutePosition = {
          x: (elkNode.x ?? 0) + parentPosition.x,
          y: (elkNode.y ?? 0) + parentPosition.y,
        };
        elkNode.children.forEach((childElk) => {
          applyPositions(childElk, absolutePosition);
        });
      }
    }
  };

  applyPositions(layoutedGraph);
  
  return nodes;
};