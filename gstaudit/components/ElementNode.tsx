import React, { memo, useEffect, useState, useCallback } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { GstElement, GstPad } from '@/lib/gst';
import { usePads, useSinkSrcPads } from '@/hooks';
import PadHandle from './PadHandle';
import type { PadConnectionInfo } from './types';
import { getTheme } from '@/lib/theme';

interface ElementNodeData {
  element: GstElement;
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad) => void;
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad) => void;
  onConnectionAdded?: (connection: PadConnectionInfo) => void;
  onConnectionRemoved?: (connection: PadConnectionInfo) => void;
}

const ElementNode: React.FC<NodeProps> = ({ data, id }) => {
  const nodeData = data as unknown as ElementNodeData;
  const updateNodeInternals = useUpdateNodeInternals();
  const [elementName, setElementName] = useState<string>('');
  const [factoryName, setFactoryName] = useState<string>('');
  
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
    nodeData.element,
    onPadAdded,
    onPadRemoved
  );
  
  // Get element name and factory name
  useEffect(() => {
    const fetchElementInfo = async () => {
      try {
        const name = await nodeData.element.get_name();
        setElementName(name);
        
        const factory = await nodeData.element.get_factory();
        const factoryNameStr = await factory.get_name();
        setFactoryName(factoryNameStr);
      } catch (err) {
        console.error('Error getting element info:', err);
        setElementName('Unknown');
        setFactoryName('Unknown');
      }
    };
    fetchElementInfo();
  }, [nodeData.element]);
  
  // Update React Flow internals when pads are loaded
  useEffect(() => {
    if (!loading && !error) {
      updateNodeInternals(id);
    }
  }, [sinkPads, srcPads, loading, error, updateNodeInternals, id]);

  if (loading) {
    return (
      <div className="gst-audit-element-node gst-audit-element-node--loading">
        <div className="gst-audit-element-node__header">
          <div className="gst-audit-element-node__name">{elementName}</div>
          <div className="gst-audit-element-node__factory">{factoryName || 'Loading...'}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gst-audit-element-node gst-audit-element-node--error">
        <div className="gst-audit-element-node__header">
          <div className="gst-audit-element-node__name">{elementName}</div>
          <div className="gst-audit-element-node__factory">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Calculate node height based on pad counts
  // Ghost pads need more space (50px) vs regular pads (32px)
  const theme = getTheme();
  const nodeHeight = Math.max(
    theme.node.elementMinHeight, 
    Math.max(sinkPads.length, srcPads.length) * theme.pad.spacing + theme.node.headerHeight
  );
  const containerDimensions = {
    width: theme.node.elementWidth,
    height: nodeHeight,
    headerHeight: theme.node.headerHeight
  };

  // Determine element class based on pad types
  const hasSink = sinkPads.length > 0;
  const hasSrc = srcPads.length > 0;
  let padTypeClass = '';
  if (hasSink && hasSrc) {
    padTypeClass = 'gst-audit-element-node--both-pads';
  } else if (hasSink) {
    padTypeClass = 'gst-audit-element-node--sink-only';
  } else if (hasSrc) {
    padTypeClass = 'gst-audit-element-node--src-only';
  }

  return (
    <div 
      className={`gst-audit-element-node ${padTypeClass}`}
      style={{ height: nodeHeight, position: 'relative' }}
    >
      <div className="gst-audit-element-node__header">
        <div className="gst-audit-element-node__name">{elementName}</div>
        <div className="gst-audit-element-node__factory">{factoryName}</div>
      </div>
      
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

export default memo(ElementNode);
