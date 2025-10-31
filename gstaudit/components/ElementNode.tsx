import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstPad, GstIterator, GObjectValue, GObjectObject, GstPadDirectionValue, GstIteratorResult, GstPadDirection } from '@/lib/gst';

interface ElementNodeData {
  label: string;
  element: GstElement;
}

interface PadInfo {
  id: string,
  name: string;
  direction: GstPadDirectionValue;
  pad: GstPad;
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
        const value = await GObjectValue.new();
        await value.unset();
        
        let done = false;
        while (!done) {
          const res = await iterator.next(value);
          switch (res) {
            case GstIteratorResult.DONE:
              done = true;
              break;
            case GstIteratorResult.OK:
              try {
                const obj: GObjectObject = await value.get_object();
                const pad: GstPad = await obj.castTo(GstPad);
                const name = await pad.get_name();
                const id = `${await nodeData.element.get_name()}-${name}`;
                const direction = await pad.get_direction();
                
                padList.push({
                  id,
                  name,
                  direction,
                  pad
                });
                
                await value.unset();
              } catch (err) {
                console.error('Error processing pad:', err);
              }
              break;
            case GstIteratorResult.RESYNC:
              // Iterator was modified, resync and try again
              await iterator.resync();
              await value.unset();
              break;
            case GstIteratorResult.ERROR:
              console.error('Error iterating pads');
              done = true;
              break;
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
      {sinkPads.map((pad, index) => (
        <React.Fragment key={`sink-${pad.name}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={pad.id}
            style={{
              top: 30 + index * 20,
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
              top: 26 + index * 20,
              fontSize: '10px'
            }}
          >
            {pad.name}
          </div>
        </React.Fragment>
      ))}
      
      {/* Source pads (outputs) on the right */}
      {srcPads.map((pad, index) => (
        <React.Fragment key={`src-${pad.name}`}>
          <Handle
            type="source"
            position={Position.Right}
            id={pad.id}
            style={{
              top: 30 + index * 20,
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
              top: 26 + index * 20,
              fontSize: '10px',
              textAlign: 'right'
            }}
          >
            {pad.name}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default memo(ElementNode);
