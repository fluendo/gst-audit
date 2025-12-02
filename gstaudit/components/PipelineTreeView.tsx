import React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ElementTreeManager, ElementTree } from '@/lib';
import { GstPadDirection } from '@/lib/gst';

interface PipelineTreeViewProps {
  treeManager: ElementTreeManager;
  onElementSelect?: (element: ElementTree | null) => void;
}

export function PipelineTreeView({ treeManager, onElementSelect }: PipelineTreeViewProps) {
  const root = treeManager.getRoot();

  const renderTreeItems = (node: ElementTree): React.ReactNode => {
    return (
      <TreeItem 
        key={node.id} 
        itemId={node.id} 
        label={node.name}
      >
        {/* Render children first */}
        {node.children.length > 0 && node.children.map(child => renderTreeItems(child))}
        
        {/* Then render pads */}
        {node.pads.length > 0 && node.pads.map(pad => (
          <TreeItem
            key={pad.id}
            itemId={pad.id}
            label={pad.name}
          />
        ))}
      </TreeItem>
    );
  };

  if (!root) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        No pipeline loaded
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-2">
      <SimpleTreeView
        defaultExpandedItems={[root.id]}
        slots={{
          collapseIcon: ExpandMoreIcon,
          expandIcon: ChevronRightIcon,
        }}
        onItemSelectionToggle={(event, itemId, isSelected) => {
          if (isSelected && onElementSelect) {
            const element = treeManager.getElementById(itemId);
            onElementSelect(element);
          }
        }}
      >
        {renderTreeItems(root)}
      </SimpleTreeView>
    </div>
  );
}
