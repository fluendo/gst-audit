import React, { useMemo, useState, useEffect } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ElementTreeManager, ElementTree } from '@/lib';
import { GstPadDirection } from '@/lib/gst';

interface PipelineTreeViewProps {
  treeManager: ElementTreeManager;
  selectedElement?: ElementTree | null;
  onElementSelect?: (element: ElementTree | null) => void;
}

export function PipelineTreeView({ treeManager, selectedElement, onElementSelect }: PipelineTreeViewProps) {
  const root = treeManager.getRoot();

  // Maintain our own expanded state
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Initialize expanded items when root changes
  useEffect(() => {
    if (root) {
      setExpandedItems([root.id]);
    }
  }, [root]);

  // When selected element changes, ensure all its ancestors are expanded
  useEffect(() => {
    if (selectedElement) {
      const ancestorIds = new Set(expandedItems);
      let current: ElementTree | null = selectedElement.parent;
      
      while (current) {
        ancestorIds.add(current.id);
        current = current.parent;
      }
      
      setExpandedItems(Array.from(ancestorIds));
    }
  }, [selectedElement]);

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
        expansionTrigger="iconContainer"
        expandedItems={expandedItems}
        onExpandedItemsChange={(event, itemIds) => {
          setExpandedItems(itemIds);
        }}
        selectedItems={selectedElement?.id || null}
        onItemSelectionToggle={(event, itemId, isSelected) => {
          // Check if the click originated from the icon container
          const target = event?.target as HTMLElement;
          const isIconClick = target?.closest('.MuiTreeItem-iconContainer');
          
          // Only handle selection if it wasn't from clicking the icon
          if (!isIconClick && isSelected && onElementSelect) {
            const element = treeManager.getElementById(itemId);
            onElementSelect(element);
          }
        }}
        slots={{
          collapseIcon: ExpandMoreIcon,
          expandIcon: ChevronRightIcon,
        }}
      >
        {renderTreeItems(root)}
      </SimpleTreeView>
    </div>
  );
}
