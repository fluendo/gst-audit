import { Position } from '@xyflow/react';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { NodeTree } from './NodeTreeManager';

const elk = new ELK();

const nodeWidth = 172;
const nodeHeight = 36;

export const getLayoutedElements = async (nodeTree: NodeTree, direction = 'LR') => {
  const isHorizontal = direction === 'LR';

  // Build ELK graph structure directly from tree
  const buildElkNode = (tree: NodeTree): ElkNode => {
    const isGroup = tree.children.length > 0;

    const elkNode: ElkNode = {
      id: tree.node.id,
      // For groups, use minimum size; for elements, use standard size
      ...(isGroup ? {} : { width: nodeWidth, height: nodeHeight }),
      // For groups, add children and layout options
      ...(isGroup ? {
        children: tree.children.map(child => buildElkNode(child)),
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': direction === 'LR' ? 'RIGHT' : 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '70',
          'elk.padding': '[top=100,left=50,bottom=50,right=50]',
          'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
          'nodeSize.constraints': 'MINIMUM_SIZE',
          'nodeSize.minimum': '(200,120)',
        }
      } : {})
    };
    return elkNode;
  };

  const elkGraph = buildElkNode(nodeTree);
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