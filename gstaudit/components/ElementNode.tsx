import React, { memo, useEffect, useState } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement } from '@/lib/gst';
import { usePads } from '@/hooks/usePads';
import PadHandle from './PadHandle';

interface ElementNodeData {
  element: GstElement;
}

const ElementNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as ElementNodeData;
  const updateNodeInternals = useUpdateNodeInternals();
  const [elementName, setElementName] = useState<string>('');
  
  // Use the shared usePads hook
  const { sinkPads, srcPads, padtemplates, loading, error } = usePads(nodeData.element);
  
  // Get element name
  useEffect(() => {
    const fetchElementName = async () => {
      try {
        const name = await nodeData.element.get_name();
        setElementName(name);
      } catch (err) {
        console.error('Error getting element name:', err);
        setElementName('Unknown');
      }
    };
    fetchElementName();
  }, [nodeData.element]);
  
  // Update React Flow internals when pads are loaded
  useEffect(() => {
    if (!loading && !error) {
      console.error(`Updating internals for ElementNode: ${elementName}`);
      updateNodeInternals(id);
    }
  }, [sinkPads, srcPads, loading, error, updateNodeInternals, id]);

  if (loading) {
    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px]">
        <div className="text-sm font-medium text-gray-800">{elementName}</div>
        <div className="text-xs text-gray-500">Loading pads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px]">
        <div className="text-sm font-medium text-red-800">{elementName}</div>
        <div className="text-xs text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Calculate node height based on pad counts
  const nodeHeight = Math.max(60, Math.max(sinkPads.length, srcPads.length) * 20 + 40);
  const containerDimensions = {
    width: 120, // Fixed width for elements
    height: nodeHeight,
    headerHeight: 40
  };

  return (
    <div 
      className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px] relative"
      style={{ height: nodeHeight }}
    >
      {/* Element name */}
      <div className="text-sm font-medium text-gray-800 mb-1">{elementName}</div>
      <div className="text-xs text-gray-500">{sinkPads.length + srcPads.length} pad(s)</div>
      
      {/* Render sink pads using PadHandle component */}
      {sinkPads.map((pad, index) => (
        <PadHandle
          key={`${elementName}-sink-${index}`}
          pad={pad}
          index={index}
          count={sinkPads.length}
          containerDimensions={containerDimensions}
        />
      ))}
      
      {/* Render source pads using PadHandle component */}
      {srcPads.map((pad, index) => (
        <PadHandle
          key={`${elementName}-src-${index}`}
          pad={pad}
          index={index}
          count={srcPads.length}
          containerDimensions={containerDimensions}
        />
      ))}
    </div>
  );
};

export default memo(ElementNode);
