import { Position, Edge } from '@xyflow/react';
import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import { NodeTree } from './NodeTreeManager';
import { getTheme } from './theme';

const elk = new ELK();

export const getLayoutedElements = async (nodeTree: NodeTree, edges: Edge[] = [], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  const theme = getTheme();

  // Build ELK graph structure directly from tree
  const buildElkNode = (tree: NodeTree): ElkNode => {
    const isGroup = tree.children.length > 0;

    // For element nodes, use the actual height if it's been set (from pad calculations)
    // Otherwise fall back to theme minimum height
    const elementHeight = !isGroup && tree.node.style?.height 
      ? (typeof tree.node.style.height === 'number' 
          ? tree.node.style.height 
          : parseFloat(tree.node.style.height as string))
      : theme.node.elementMinHeight;

    const elkNode: ElkNode = {
      id: tree.node.id,
      // For groups, use minimum size; for elements, use actual or standard size
      ...(isGroup ? {} : { 
        width: theme.node.elementWidth, 
        height: elementHeight 
      }),
      // For groups, add children and layout options
      ...(isGroup ? {
        children: tree.children.map(child => buildElkNode(child)),
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

  const elkGraph = buildElkNode(nodeTree);
  
  // Add edges to the ELK graph
  const elkEdges: ElkExtendedEdge[] = edges.map(edge => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));
  
  elkGraph.edges = elkEdges;
  
  const layoutedGraph = await elk.layout(elkGraph);

  // Apply positions from ELK back to React Flow nodes
  const applyPositions = (elkNode: ElkNode, tree: NodeTree, parentPosition = { x: 0, y: 0 }) => {
    if (elkNode.x !== undefined && elkNode.y !== undefined) {
      tree.node.position = {
        x: tree.node.parentId ? elkNode.x : elkNode.x + parentPosition.x,
        y: tree.node.parentId ? elkNode.y : elkNode.y + parentPosition.y,
      };
      tree.node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      tree.node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      
      // Apply calculated width and height from ELK
      if (elkNode.width !== undefined && elkNode.height !== undefined) {
        tree.node.style = {
          ...tree.node.style,
          width: elkNode.width,
          height: elkNode.height,
        };
      }

      // Process children recursively
      if (elkNode.children && tree.children) {
        const absolutePosition = {
          x: (elkNode.x ?? 0) + parentPosition.x,
          y: (elkNode.y ?? 0) + parentPosition.y,
        };
        elkNode.children.forEach((childElk, index) => {
          if (tree.children[index]) {
            applyPositions(childElk, tree.children[index], absolutePosition);
          }
        });
      }
    }
  };

  applyPositions(layoutedGraph, nodeTree);
};