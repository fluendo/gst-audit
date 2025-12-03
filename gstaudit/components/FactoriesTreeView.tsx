'use client';

import { useState, useEffect } from 'react';
import { FactoryTreeManager, FactoryTreeNode } from '@/lib';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface FactoriesTreeViewProps {
  treeManager: FactoryTreeManager | null;
  selectedFactory: string | null;
  onFactorySelect: (factoryName: string | null) => void;
}

export function FactoriesTreeView({ treeManager, selectedFactory, onFactorySelect }: FactoriesTreeViewProps) {
  const factoryTree = treeManager?.getRoot() || null;
  const loading = treeManager?.isLoading() || false;
  const error = treeManager?.getError() || null;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Expand parent nodes when a factory is selected
  useEffect(() => {
    if (selectedFactory && factoryTree) {
      const pathToExpand: string[] = [];
      
      // Find the path to the selected factory
      const findPath = (node: FactoryTreeNode, target: string, currentPath: string[] = []): boolean => {
        // Check if this node contains the factory
        if (node.factories.some(f => f.name === target)) {
          pathToExpand.push(...currentPath);
          return true;
        }
        
        // Recursively check children
        for (const [_, childNode] of node.children) {
          if (findPath(childNode, target, [...currentPath, childNode.fullPath])) {
            return true;
          }
        }
        
        return false;
      };
      
      findPath(factoryTree, selectedFactory);
      
      // Merge with existing expanded items
      setExpandedItems(prev => {
        const newItems = new Set([...prev, ...pathToExpand]);
        return Array.from(newItems);
      });
    }
  }, [selectedFactory, factoryTree]);

  const countFactories = (node: FactoryTreeNode): number => {
    if (!treeManager) return 0;
    return treeManager.countFactories(node);
  };

  const renderTreeNode = (node: FactoryTreeNode): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    
    node.children.forEach((childNode) => {
      const hasChildren = childNode.children.size > 0;
      const hasFactories = childNode.factories.length > 0;
      const totalFactories = countFactories(childNode);
      
      elements.push(
        <TreeItem
          key={childNode.fullPath}
          itemId={childNode.fullPath}
          label={`${childNode.name} (${totalFactories})`}
        >
          {/* Render child nodes first */}
          {hasChildren && renderTreeNode(childNode)}
          
          {/* Render factories at this level */}
          {hasFactories && childNode.factories.map(factory => (
            <TreeItem
              key={factory.name}
              itemId={factory.name}
              label={factory.name}
              onClick={() => onFactorySelect(factory.name)}
              sx={{
                '& .MuiTreeItem-content': {
                  backgroundColor: selectedFactory === factory.name ? 'action.selected' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                },
              }}
            />
          ))}
        </TreeItem>
      );
    });
    
    return elements;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Loading factories...</p>
          </div>
        )}

        {error && (
          <div className="m-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
            <h2 className="text-red-800 dark:text-red-200 font-semibold text-sm mb-2">Error</h2>
            <p className="text-red-700 dark:text-red-300 text-xs">{error}</p>
          </div>
        )}

        {!loading && !error && factoryTree && (
          <SimpleTreeView
            selectedItems={selectedFactory}
            expandedItems={expandedItems}
            onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
          >
            {renderTreeNode(factoryTree)}
          </SimpleTreeView>
        )}

        {!loading && !error && !factoryTree && (
          <div className="text-center py-8 px-3 text-gray-600 dark:text-gray-400">
            <p className="text-xs">No factories loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}
