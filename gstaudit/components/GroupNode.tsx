import React, { memo, useEffect, useState } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';
import { ElementTree } from '@/lib';
import { GstPadDirection } from '@/lib/gst';
import PadHandle from './PadHandle';
import { getTheme } from '@/lib/theme';

const GroupNode: React.FC<NodeProps> = ({ data, id, width, height }) => {
  const tree = data as unknown as ElementTree;
  const theme = getTheme();
  const [factoryName, setFactoryName] = useState<string>('');
  const updateNodeInternals = useUpdateNodeInternals();

  // Get pads directly from ElementTree
  // Filter out internal pads as they will be rendered separately
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

  // Get the actual node dimensions from React Flow/ELK
  const nodeWidth = width || 200;
  const nodeHeight = height || 120;
  
  // Helper function to calculate pad position
  const calculatePadPosition = (index: number, count: number) => {
    const headerHeight = 60; // Header height for group nodes
    const availableHeight = nodeHeight - headerHeight;
    return headerHeight + ((index + 1) * availableHeight / (count + 1));
  };

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
      {sinkPads.map((pad, index) => {
        const hasInternal = pad.internal !== null;
        const isSink = pad.direction === GstPadDirection.SINK;
        const padPosition = calculatePadPosition(index, sinkPads.length);
        const containerHeight = hasInternal ? theme.pad.ghostContainerHeight : theme.pad.height;
        
        return (
          <div
            key={`sink-${pad.id}`}
            className={`gst-audit-pad-container ${hasInternal ? 'gst-audit-pad-container--ghost' : ''} ${isSink ? 'gst-audit-pad-container--sink' : 'gst-audit-pad-container--src'}`}
            style={{ top: padPosition - (containerHeight / 2) }}
          >
            <PadHandle
              padData={pad}
            />
            {/* Render internal pad if it exists, using same index */}
            {pad.internal && (
              <PadHandle
                padData={pad.internal}
              />
            )}
          </div>
        );
      })}
      
      {/* Render source pads using PadHandle component */}
      {srcPads.map((pad, index) => {
        const hasInternal = pad.internal !== null;
        const isSink = pad.direction === GstPadDirection.SINK;
        const padPosition = calculatePadPosition(index, srcPads.length);
        const containerHeight = hasInternal ? theme.pad.ghostContainerHeight : theme.pad.height;
        
        return (
          <div
            key={`src-${pad.id}`}
            className={`gst-audit-pad-container ${hasInternal ? 'gst-audit-pad-container--ghost' : ''} ${isSink ? 'gst-audit-pad-container--sink' : 'gst-audit-pad-container--src'}`}
            style={{ top: padPosition - (containerHeight / 2) }}
          >
            <PadHandle
              padData={pad}
            />
            {/* Render internal pad if it exists, using same index */}
            {pad.internal && (
              <PadHandle
                padData={pad.internal}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(GroupNode);