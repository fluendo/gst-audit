import { Node } from '@xyflow/react';

// Tree structure for hierarchical nodes
export interface NodeTree {
  node: Node;
  children: NodeTree[];
  handles: string[]; // Track handles (pad IDs) for this node
}

export class NodeTreeManager {
  private root: NodeTree | null = null;

  // Helper function to find node in tree
  private findNodeInTree(tree: NodeTree, nodeId: string): NodeTree | null {
    if (tree.node.id === nodeId) return tree;
    for (const child of tree.children) {
      const found = this.findNodeInTree(child, nodeId);
      if (found) return found;
    }
    return null;
  }

  // Helper function to get all nodes from tree
  getAllNodesFromTree(tree?: NodeTree): Node[] {
    const targetTree = tree || this.root;
    if (!targetTree) return [];
    
    const nodes = [targetTree.node];
    targetTree.children.forEach(child => {
      nodes.push(...this.getAllNodesFromTree(child));
    });
    return nodes;
  }

  // Deep clone the tree to avoid mutations
  private cloneTree(tree: NodeTree): NodeTree {
    return {
      node: { ...tree.node },
      children: tree.children.map(child => this.cloneTree(child)),
      handles: [...tree.handles]
    };
  }

  // Add node to tree
  addNodeToTree(parentId: string, newNode: Node): boolean {
    if (!this.root) return false;
    
    const cloned = this.cloneTree(this.root);
    const parent = this.findNodeInTree(cloned, parentId);
    
    if (parent) {
      parent.children.push({ node: newNode, children: [], handles: [] });
      this.root = cloned;
      return true;
    }
    
    return false;
  }

  // Remove node from tree
  removeNodeFromTree(nodeId: string): boolean {
    if (!this.root) return false;
    
    // If removing the root node
    if (this.root.node.id === nodeId) {
      this.root = null;
      return true;
    }
    
    const cloned = this.cloneTree(this.root);
    
    // Recursive function to remove node from tree
    const removeFromTree = (tree: NodeTree): NodeTree | null => {
      if (tree.node.id === nodeId) {
        return null;
      }
      
      tree.children = tree.children
        .map(child => removeFromTree(child))
        .filter((child): child is NodeTree => child !== null);
      
      return tree;
    };
    
    const result = removeFromTree(cloned);
    if (result) {
      this.root = result;
      return true;
    }
    
    return false;
  }

  // Clear tree
  clearTree(): void {
    this.root = null;
  }

  // Initialize tree with root node
  initializeTree(rootNode: Node): NodeTree {
    const tree: NodeTree = {
      node: rootNode,
      children: [],
      handles: []
    };
    this.root = tree;
    return tree;
  }

  // Get the current tree
  getTree(): NodeTree | null {
    return this.root;
  }

  // Find a specific node in the tree
  findNode(nodeId: string): NodeTree | null {
    if (!this.root) return null;
    return this.findNodeInTree(this.root, nodeId);
  }

  // Get all nodes as a flat array
  getAllNodes(): Node[] {
    return this.getAllNodesFromTree();
  }

  // Add handle to a specific node
  addHandleToNode(nodeId: string, handleId: string): boolean {
    if (!this.root) return false;
    
    const cloned = this.cloneTree(this.root);
    const targetNode = this.findNodeInTree(cloned, nodeId);
    
    if (targetNode && !targetNode.handles.includes(handleId)) {
      targetNode.handles.push(handleId);
      this.root = cloned;
      return true;
    }
    
    return false;
  }

  // Remove handle from a specific node
  removeHandleFromNode(nodeId: string, handleId: string): boolean {
    if (!this.root) return false;
    
    const cloned = this.cloneTree(this.root);
    const targetNode = this.findNodeInTree(cloned, nodeId);
    
    if (targetNode) {
      const handleIndex = targetNode.handles.indexOf(handleId);
      if (handleIndex > -1) {
        targetNode.handles.splice(handleIndex, 1);
        this.root = cloned;
        return true;
      }
    }
    
    return false;
  }

  // Get handles for a specific node
  getNodeHandles(nodeId: string): string[] {
    if (!this.root) return [];
    
    const targetNode = this.findNodeInTree(this.root, nodeId);
    return targetNode ? [...targetNode.handles] : [];
  }
}