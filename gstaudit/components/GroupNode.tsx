import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstPad, GstGhostPad, GObjectValue, GObjectObject, GstPadDirectionValue, GstPadDirection } from '@/lib/gst';

interface GroupNodeData {
  label: string;
  element: GstElement;
  isGstBin?: boolean;
}

interface PadInfo {
  id: string,
  name: string;
  direction: GstPadDirectionValue;
  isGhost: boolean;
  internalName?: string; // Name of the internal pad
}

const GroupNode: React.FC<NodeProps> = ({ data, id, width, height }) => {
  const nodeData = data as unknown as GroupNodeData;
  const [pads, setPads] = useState<PadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Get the actual node dimensions from React Flow/ELK
  const nodeWidth = width || 200;
  const nodeHeight = height || 120;

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
            
            // Check if this is a ghost pad
            const isGhost = await pad.isOf(GstGhostPad);
            let internalName: string | undefined;
            
            if (isGhost) {
              try {
                const ghostPad = await pad.castTo(GstGhostPad);
                const internal = await ghostPad.get_internal();
                if (internal) {
                  internalName = await internal.get_name();
                }
              } catch (err) {
                console.error('Error getting ghost pad internal:', err);
              }
            }
            
            padList.push({
              id,
              name,
              direction,
              isGhost,
              internalName
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
      <div 
        className="bg-purple-50 rounded-lg shadow-sm w-full h-full min-w-[200px] relative"
        style={{
          minHeight: 120,
          border: 'none',
          backgroundColor: 'rgb(250 245 255)'
        }}
      >
        <div className="p-4">
          <div className="text-sm font-medium text-purple-800">{nodeData.label}</div>
          <div className="text-xs text-purple-600">Loading pads...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="bg-red-50 rounded-lg shadow-sm w-full h-full min-w-[200px] relative"
        style={{
          minHeight: 120,
          border: 'none',
          backgroundColor: 'rgb(254 242 242)'
        }}
      >
        <div className="p-4">
          <div className="text-sm font-medium text-red-800">{nodeData.label}</div>
          <div className="text-xs text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-purple-50 rounded-lg shadow-sm w-full h-full min-w-[200px] relative"
      style={{
        width: nodeWidth,
        height: nodeHeight,
        // Override React Flow's default group styling
        border: 'none',
        backgroundColor: 'rgb(250 245 255)', // purple-50
        borderRadius: '8px'
      }}
    >
      {/* Header area for the bin information */}
      <div className="p-3 border-b border-purple-200 bg-purple-100 rounded-t-lg">
        <div className="text-sm font-medium text-purple-800 mb-1">
          {nodeData.label} <span className="text-xs font-bold"></span>
        </div>
        <div className="text-xs text-purple-600">{pads.length} pad(s)</div>
      </div>
      
      {/* Content area for children - React Flow will position children here */}
      <div className="flex-1 min-h-[60px]"></div>
      
      {/* Sink pads (inputs) distributed across full height */}
      {sinkPads.map((pad, index) => {
        const headerHeight = 60; // Header height
        const availableHeight = nodeHeight - headerHeight - 20; // Available space below header
        
        let padPosition;
        if (sinkPads.length === 1) {
          // Center single pad
          padPosition = headerHeight + availableHeight / 2;
        } else {
          // For multiple pads, distribute evenly: 1/(n+1), 2/(n+1), 3/(n+1), etc.
          padPosition = headerHeight + ((index + 1) * availableHeight / (sinkPads.length + 1));
        }
        
        const elements = [];
        
        // Main pad (ghost or regular)
        elements.push(
          <Handle
            key={pad.id}
            type="target"
            position={Position.Left}
            id={pad.id}
            style={{
              top: padPosition,
              backgroundColor: '#ef4444',
              width: 8,
              height: 8,
              border: '1px solid #1f2937',
              zIndex: 10
            }}
          />
        );
        
        // If this is a ghost pad with a internal, render the internal at the same position
        if (pad.isGhost && pad.internalName) {
          const internalId = `${pad.name}-${pad.internalName}`;
          elements.push(
            <Handle
              key={internalId}
              type="source"
              position={Position.Left}
              id={internalId}
              style={{
                top: padPosition,
                left: 10, // Position inside the container
                backgroundColor: '#3b82f6', // blue for internal
                width: 8,
                height: 8,
                border: '1px solid #1f2937',
                borderRadius: '50%',
                zIndex: 9
              }}
            />
          );
        }
        
        elements.push(
          <div 
            key={`label-${pad.id}`}
            className="absolute text-xs text-purple-700"
            style={{
              left: 12,
              top: padPosition - 4, // Center text with handle
              fontSize: '10px',
              zIndex: 5
            }}
          >
            {pad.name}
          </div>
        );
        
        return (
          <React.Fragment key={`sink-${pad.name}`}>
            {elements}
          </React.Fragment>
        );
      })}
      
      {/* Source pads (outputs) distributed across full height */}
      {srcPads.map((pad, index) => {
        const headerHeight = 60; // Header height
        const availableHeight = nodeHeight - headerHeight - 20; // Available space below header
        
        let padPosition;
        if (srcPads.length === 1) {
          // Center single pad
          padPosition = headerHeight + availableHeight / 2;
        } else {
          // For multiple pads, distribute evenly: 1/(n+1), 2/(n+1), 3/(n+1), etc.
          padPosition = headerHeight + ((index + 1) * availableHeight / (srcPads.length + 1));
        }
        
        const elements = [];
        
        // Main pad (ghost or regular)
        elements.push(
          <Handle
            key={pad.id}
            type="source"
            position={Position.Right}
            id={pad.id}
            style={{
              top: padPosition,
              backgroundColor: '#22c55e',
              width: 8,
              height: 8,
              border: '1px solid #1f2937',
              zIndex: 10
            }}
          />
        );
        
        // If this is a ghost pad with a internal, render the internal at the same position
        if (pad.isGhost && pad.internalName) {
          const internalId = `${pad.name}-${pad.internalName}`;
          elements.push(
            <Handle
              key={internalId}
              type="target"
              position={Position.Right}
              id={internalId}
              style={{
                top: padPosition,
                right: 10, // Position inside the container
                backgroundColor: '#3b82f6', // blue for internal
                width: 8,
                height: 8,
                border: '1px solid #1f2937',
                borderRadius: '50%',
                zIndex: 9
              }}
            />
          );
        }
        
        elements.push(
          <div 
            key={`label-${pad.id}`}
            className="absolute text-xs text-purple-700"
            style={{
              right: 12,
              top: padPosition - 4, // Center text with handle
              fontSize: '10px',
              textAlign: 'right',
              zIndex: 5
            }}
          >
            {pad.name}
          </div>
        );
        
        return (
          <React.Fragment key={`src-${pad.name}`}>
            {elements}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default memo(GroupNode);