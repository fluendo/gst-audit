import React, { memo, useEffect, useState } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstBin, GstPad } from '@/lib/gst';
import { usePads } from '@/hooks';
import PadHandle from './PadHandle';
import type { PadConnectionInfo } from './types';

interface GroupNodeData {
  bin: GstBin;
  onElementAdded?: (parentId: string, parentBin: GstBin, element: GstElement) => Promise<void>;
  onElementRemoved?: (parentId: string, parentBin: GstBin, element: GstElement) => Promise<void>;
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void;
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void;
  onConnectionAdded?: (connection: PadConnectionInfo) => void;
  onConnectionRemoved?: (connection: PadConnectionInfo) => void;
}

const GroupNode: React.FC<NodeProps> = ({ data, id, width, height }) => {
  const nodeData = data as unknown as GroupNodeData;
  const updateNodeInternals = useUpdateNodeInternals();
  const [elementName, setElementName] = useState<string>('');

  // Use the shared usePads hook with callbacks
  const { sinkPads, srcPads, padtemplates, loading, error } = usePads(
    nodeData.bin,
    nodeData.onPadAdded,
    nodeData.onPadRemoved,
    nodeData.onConnectionAdded,
    nodeData.onConnectionRemoved
  );

  // Get the actual node dimensions from React Flow/ELK
  const nodeWidth = width || 200;
  const nodeHeight = height || 120;

  // Get element name
  useEffect(() => {
    const fetchElementName = async () => {
      try {
        const name = await nodeData.bin.get_name();
        setElementName(name);
      } catch (err) {
        console.error('Error getting element name:', err);
        setElementName('Unknown');
      }
    };
    fetchElementName();
  }, [nodeData.bin]);

  // Update React Flow internals when pads are loaded
  useEffect(() => {
    if (!loading && !error) {
      updateNodeInternals(id);
    }
  }, [sinkPads, srcPads, loading, error, updateNodeInternals, id]);

  useEffect(() => {
      let isMounted = true;
      
      const addChildren = async () => {
          if (!isMounted) return;
          
          const iterator = await nodeData.bin.iterate_elements();

          for await (const obj of iterator) {
            if (!isMounted) return;
            
            const child: GstElement = await obj.castTo(GstElement);
            await nodeData.onElementAdded?.(id, nodeData.bin, child);
          }
      }
      
      addChildren();
      
      return () => {
          isMounted = false;
          
          const removeChildren = async () =>  {
              const iterator = await nodeData.bin.iterate_elements();

              for await (const obj of iterator) {
                const child: GstElement = await obj.castTo(GstElement);
                await nodeData.onElementRemoved?.(id, nodeData.bin, child);
              }
          }
          removeChildren().catch(console.error);
      }
  }, []);

  // Container dimensions for PadHandle component
  const containerDimensions = {
    width: nodeWidth,
    height: nodeHeight,
    headerHeight: 60 // Header height for group nodes
  };

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
          <div className="text-sm font-medium text-purple-800">{elementName}</div>
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
          <div className="text-sm font-medium text-red-800">{elementName}</div>
          <div className="text-xs text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm min-w-[120px]"
      style={{
        width: nodeWidth,
        height: nodeHeight,
        // Override React Flow's default group styling
        border: 'none',
        borderRadius: '8px'
      }}
    >
      {/* Header area for the bin information */}
      <div className="p-3 border-b border-purple-200 bg-purple-100 rounded-t-lg">
        <div className="text-sm font-medium text-purple-800 mb-1">
          {elementName} <span className="text-xs font-bold"></span>
        </div>
        <div className="text-xs text-purple-600">{sinkPads.length + srcPads.length} pad(s)</div>
      </div>
      
      {/* Content area for children - React Flow will position children here */}
      <div className="flex-1 min-h-[60px]"></div>
      
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

export default memo(GroupNode);