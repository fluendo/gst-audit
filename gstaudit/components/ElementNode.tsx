import React, { memo, useEffect, useState } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { ElementTree, ElementPad } from '@/lib';
import { GstPadDirection } from '@/lib/gst';
import PadHandle from './PadHandle';
import { getTheme } from '@/lib/theme';

const ElementNode: React.FC<NodeProps> = ({ data, id }) => {
  const tree = data as unknown as ElementTree;
  const theme = getTheme();
  const [factoryName, setFactoryName] = useState<string>('');
  const updateNodeInternals = useUpdateNodeInternals();
  
  // Get pads directly from ElementTree
  const sinkPads = tree.pads.filter(p => p.direction === GstPadDirection.SINK && !p.isInternal);
  const srcPads = tree.pads.filter(p => p.direction === GstPadDirection.SRC && !p.isInternal);

  // Fetch factory name
  useEffect(() => {
    const fetchFactoryName = async () => {
      try {
        const factory = await tree.element.get_factory();
        if (factory) {
          const name = await factory.get_name();
          setFactoryName(name ?? 'Unknown');
        } else {
          setFactoryName('Unknown');
        }
      } catch (err) {
        console.error('Error getting factory name:', err);
        setFactoryName('Unknown');
      }
    };
    fetchFactoryName();
  }, [tree.element]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [tree.pads, id, updateNodeInternals]);
  
  // Calculate node height based on pad counts
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
        <div className="gst-audit-element-node__name">{tree.name}</div>
        <div className="gst-audit-element-node__factory">{factoryName}</div>
      </div>
      
      {/* Render sink pads using PadHandle component */}
      {sinkPads.map((pad, index) => (
        <PadHandle
          key={`sink-${pad.id}`}
          padData={pad}
          index={index}
          count={sinkPads.length}
          containerDimensions={containerDimensions}
        />
      ))}
      
      {/* Render source pads using PadHandle component */}
      {srcPads.map((pad, index) => (
        <PadHandle
          key={`src-${pad.id}`}
          padData={pad}
          index={index}
          count={srcPads.length}
          containerDimensions={containerDimensions}
        />
      ))}
    </div>
  );
};

export default memo(ElementNode);
