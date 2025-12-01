import React, { memo, useEffect, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { ElementTree } from '@/lib';
import { GstPadDirection } from '@/lib/gst';
import PadHandle from './PadHandle';

const GroupNode: React.FC<NodeProps> = ({ data, id, width, height }) => {
  const tree = data as unknown as ElementTree;
  const [factoryName, setFactoryName] = useState<string>('');

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

  // Get the actual node dimensions from React Flow/ELK
  const nodeWidth = width || 200;
  const nodeHeight = height || 120;

  // Container dimensions for PadHandle component
  const containerDimensions = {
    width: nodeWidth,
    height: nodeHeight,
    headerHeight: 60 // Header height for group nodes
  };

  return (
    <div 
      className="gst-audit-group-node"
      style={{
        width: nodeWidth,
        height: nodeHeight
      }}
    >
      <div className="gst-audit-group-node__header">
        <div className="gst-audit-group-node__name">{tree.name}</div>
        <div className="gst-audit-group-node__factory">{factoryName}</div>
      </div>
      
      <div className="gst-audit-group-node__content"></div>
      
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

export default memo(GroupNode);