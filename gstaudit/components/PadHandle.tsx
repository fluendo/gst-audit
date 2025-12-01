import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ElementPad } from '@/lib';
import { GstPadDirection } from '@/lib/gst';
import { getTheme } from '@/lib/theme';

interface ContainerDimensions {
  width: number;
  height: number;
  headerHeight: number;
}

interface PadHandleProps {
  padData: ElementPad;
  index: number;
  count: number;
  containerDimensions: ContainerDimensions;
}

const PadHandle: React.FC<PadHandleProps> = ({
  padData,
  index,
  count,
  containerDimensions,
}) => {
  const theme = getTheme();

  // Calculate pad position
  const { width, height, headerHeight } = containerDimensions;
  // Available height is the area below the header
  const availableHeight = height - headerHeight;

  // Use consistent formula: distribute evenly using (index + 1) / (count + 1)
  const padPosition = headerHeight + ((index + 1) * availableHeight / (count + 1));

  // Determine handle properties based on direction
  const isSink = padData.direction === GstPadDirection.SINK;
  const handleType = isSink ? 'target' : 'source';
  const position = isSink ? Position.Left : Position.Right;
  const handleClassName = isSink ? 'gst-audit-pad-handle gst-audit-pad-handle--sink' : 'gst-audit-pad-handle gst-audit-pad-handle--src';

  // Use theme values for consistent sizing
  const isGhost = padData.isGhost && padData.isInternal;
  const containerHeight = isGhost ? theme.pad.ghostContainerHeight : theme.pad.height;
  
  // Handles have fixed dimensions and don't need additional styling
  const handleStyle = {};
  const internalHandleStyle = {};

  // Container classes
  const containerClass = isGhost 
    ? `gst-audit-pad-container gst-audit-pad-container--ghost ${isSink ? 'gst-audit-pad-container--sink' : 'gst-audit-pad-container--src'}`
    : `gst-audit-pad-container ${isSink ? 'gst-audit-pad-container--sink' : 'gst-audit-pad-container--src'}`;

  return (
    <div 
      className={containerClass}
      style={{ top: padPosition - (containerHeight / 2) }}
    >
      {/* Main Handle (ghost or regular) with pad name inside */}
      <Handle
        type={handleType}
        position={position}
        id={padData.representation}
        className={handleClassName}
        style={handleStyle}
      >
        <span className="gst-audit-pad-handle__text">{padData.name}</span>
      </Handle>
      
      {/* Ghost pad internal handle - positioned below the ghost pad */}
      {isGhost && (
        <Handle
          type={isSink ? 'source' : 'target'} // Opposite type for internal
          position={position}
          id={`${padData.representation}-internal`}
          className="gst-audit-pad-handle gst-audit-pad-handle--internal"
          style={internalHandleStyle}
        >
          <span className="gst-audit-pad-handle__text">internal</span>
        </Handle>
      )}
    </div>
  );
};

export default PadHandle;