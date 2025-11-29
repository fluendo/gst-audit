import React, { memo, useEffect, useState, useCallback } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstBin, GstPad } from '@/lib/gst';
import { usePads, useSinkSrcPads } from '@/hooks';
import PadHandle from './PadHandle';
import type { PadConnectionInfo } from './types';

interface GroupNodeData {
  bin: GstBin;
  onElementAdded?: (parentId: string, parentBin: GstBin, element: GstElement) => Promise<void>;
  onElementRemoved?: (parentId: string, parentBin: GstBin, element: GstElement) => Promise<void>;
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad) => void;
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad) => void;
  onConnectionAdded?: (connection: PadConnectionInfo) => void;
  onConnectionRemoved?: (connection: PadConnectionInfo) => void;
}

const GroupNode: React.FC<NodeProps> = ({ data, id, width, height }) => {
  const nodeData = data as unknown as GroupNodeData;
  const updateNodeInternals = useUpdateNodeInternals();
  const [elementName, setElementName] = useState<string>('');

  // Get local accumulation handlers
  const { sinkPads, srcPads, handlePadAdded, handlePadRemoved } = useSinkSrcPads();
  
  // Wrapper that accumulates locally AND forwards to parent
  const onPadAdded = useCallback(async (elementId: string, element: GstElement, pad: GstPad) => {
    await handlePadAdded(elementId, element, pad);
    nodeData.onPadAdded?.(elementId, element, pad);
  }, [handlePadAdded, nodeData.onPadAdded]);
  
  const onPadRemoved = useCallback((elementId: string, element: GstElement, pad: GstPad) => {
    handlePadRemoved(elementId, element, pad);
    nodeData.onPadRemoved?.(elementId, element, pad);
  }, [handlePadRemoved, nodeData.onPadRemoved]);
  
  // Use pad discovery hook with wrapped callbacks
  const { padtemplates, loading, error } = usePads(
    nodeData.bin,
    onPadAdded,
    onPadRemoved
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

  // Update React Flow internals when pads are loaded or dimensions change
  useEffect(() => {
    if (!loading && !error) {
      updateNodeInternals(id);
    }
  }, [sinkPads, srcPads, loading, error, updateNodeInternals, id, width, height]);

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
        className="gst-audit-group-node gst-audit-group-node--loading"
        style={{
          minHeight: 150,
          width: '100%',
          height: '100%'
        }}
      >
        <div className="gst-audit-group-node__header">
          <div className="gst-audit-group-node__name">{elementName}</div>
          <div className="gst-audit-group-node__info">Loading pads...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="gst-audit-group-node gst-audit-group-node--error"
        style={{
          minHeight: 150,
          width: '100%',
          height: '100%'
        }}
      >
        <div className="gst-audit-group-node__header">
          <div className="gst-audit-group-node__name">{elementName}</div>
          <div className="gst-audit-group-node__info">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="gst-audit-group-node"
      style={{
        width: nodeWidth,
        height: nodeHeight
      }}
    >
      <div className="gst-audit-group-node__header">
        <div className="gst-audit-group-node__name">{elementName}</div>
        <div className="gst-audit-group-node__info">{sinkPads.length + srcPads.length} pad(s)</div>
      </div>
      
      <div className="gst-audit-group-node__content"></div>
      
      {/* Render sink pads using PadHandle component */}
      {sinkPads.map((pad, index) => (
        <PadHandle
          key={`sink-${pad.ptr}`}
          pad={pad}
          index={index}
          count={sinkPads.length}
          containerDimensions={containerDimensions}
          onConnectionAdded={nodeData.onConnectionAdded}
          onConnectionRemoved={nodeData.onConnectionRemoved}
        />
      ))}
      
      {/* Render source pads using PadHandle component */}
      {srcPads.map((pad, index) => (
        <PadHandle
          key={`src-${pad.ptr}`}
          pad={pad}
          index={index}
          count={srcPads.length}
          containerDimensions={containerDimensions}
          onConnectionAdded={nodeData.onConnectionAdded}
          onConnectionRemoved={nodeData.onConnectionRemoved}
        />
      ))}
    </div>
  );
};

export default memo(GroupNode);