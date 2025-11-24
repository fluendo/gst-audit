import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstPad, GObjectValue, GObjectObject, GstPadDirectionValue, GstPadDirection } from '@/lib/gst';

interface ElementNodeData {
  label: string;
  element: GstElement;
}

interface PadInfo {
  id: string,
  name: string;
  direction: GstPadDirectionValue;
}

const ElementNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as ElementNodeData;
  const [pads, setPads] = useState<PadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    const fetchPads = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const padList: PadInfo[] = [];
        
        // Get all pads from the element
        const iterator = await nodeData.element.iterate_pads();
        
        for await (const obj of iterator) {
          try {
            const pad: GstPad = await obj.castTo(GstPad);
            const name = await pad.get_name();
            const id = `${await nodeData.element.get_name()}-${name}`;
            const direction = await pad.get_direction();
            
            padList.push({
              id,
              name,
              direction
            });
          } catch (err) {
            console.error('Error processing pad:', err);
          }
        }
        
        setPads(padList);
        
        // Notify React Flow that handles have been updated
        updateNodeInternals(id);
      } catch (err) {
        console.error('Error fetching pads:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPads();
  }, [nodeData.element, id, updateNodeInternals]);

  // Separate pads by direction
  const sinkPads = pads.filter(pad => pad.direction === GstPadDirection.SINK);
  const srcPads = pads.filter(pad => pad.direction === GstPadDirection.SRC);

  if (loading) {
    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px]">
        <div className="text-sm font-medium text-gray-800">{nodeData.label}</div>
        <div className="text-xs text-gray-500">Loading pads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px]">
        <div className="text-sm font-medium text-red-800">{nodeData.label}</div>
        <div className="text-xs text-red-600">Error: {error}</div>
      </div>
    );
  }

  const nodeHeight = Math.max(60, Math.max(sinkPads.length, srcPads.length) * 20 + 40);

  return (
    <div 
      className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px] relative"
      style={{ height: nodeHeight }}
    >
      {/* Element name */}
      <div className="text-sm font-medium text-gray-800 mb-1">{nodeData.label}</div>
      <div className="text-xs text-gray-500">{pads.length} pad(s)</div>
      
      {/* Sink pads (inputs) on the left */}
      {sinkPads.map((pad, index) => {
        const headerHeight = 40; // Space for element name and info
        const availableHeight = nodeHeight - headerHeight - 10; // Available space for pads
        
        let padPosition;
        if (sinkPads.length === 1) {
          // Center single pad
          padPosition = headerHeight + availableHeight / 2;
        } else {
          // For multiple pads, distribute evenly: 1/(n+1), 2/(n+1), 3/(n+1), etc.
          padPosition = headerHeight + ((index + 1) * availableHeight / (sinkPads.length + 1));
        }
        
        return (
          <React.Fragment key={`sink-${pad.name}`}>
            <Handle
              type="target"
              position={Position.Left}
              id={pad.id}
              style={{
                top: padPosition,
                backgroundColor: '#ef4444',
                width: 8,
                height: 8,
                border: '1px solid #dc2626'
              }}
            />
            <div 
              className="absolute text-xs text-gray-600"
              style={{
                left: 12,
                top: padPosition - 4, // Center text with handle
                fontSize: '10px'
              }}
            >
              {pad.name}
            </div>
          </React.Fragment>
        );
      })}
      
      {/* Source pads (outputs) on the right */}
      {srcPads.map((pad, index) => {
        const headerHeight = 40; // Space for element name and info
        const availableHeight = nodeHeight - headerHeight - 10; // Available space for pads
        
        let padPosition;
        if (srcPads.length === 1) {
          // Center single pad
          padPosition = headerHeight + availableHeight / 2;
        } else {
          // For multiple pads, distribute evenly: 1/(n+1), 2/(n+1), 3/(n+1), etc.
          padPosition = headerHeight + ((index + 1) * availableHeight / (srcPads.length + 1));
        }
        
        return (
          <React.Fragment key={`src-${pad.name}`}>
            <Handle
              type="source"
              position={Position.Right}
              id={pad.id}
              style={{
                top: padPosition,
                backgroundColor: '#22c55e',
                width: 8,
                height: 8,
                border: '1px solid #16a34a'
              }}
            />
            <div 
              className="absolute text-xs text-gray-600"
              style={{
                right: 12,
                top: padPosition - 4, // Center text with handle
                fontSize: '10px',
                textAlign: 'right'
              }}
            >
              {pad.name}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default memo(ElementNode);
