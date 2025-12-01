import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ElementPad } from '@/lib';
import { GstPadDirection } from '@/lib/gst';

interface PadHandleProps {
  padData: ElementPad;
}

const PadHandle: React.FC<PadHandleProps> = ({
  padData,
}) => {

  // Determine handle properties based on direction
  const isSink = padData.direction === GstPadDirection.SINK;
  const handleType = isSink ? 'target' : 'source';
  const position = isSink ? Position.Left : Position.Right;
  
  // Determine if this is a ghost pad (but not an internal pad being rendered separately)
  const isGhost = padData.isGhost && !padData.isInternal;
  // Determine if this is an internal pad being rendered separately
  const isInternal = padData.isInternal;
  
  // Build handle class name
  let handleClassName = 'gst-audit-pad-handle';
  if (isSink) {
    handleClassName += ' gst-audit-pad-handle--sink';
  } else {
    handleClassName += ' gst-audit-pad-handle--src';
  }
  if (isInternal) {
    handleClassName += ' gst-audit-pad-handle--internal';
  }
  if (isGhost) {
    handleClassName += ' gst-audit-pad-handle--ghost';
  }

  // No inline positioning - parent container handles positioning
  const handleStyle = {};

  return (
    <Handle
      type={handleType}
      position={position}
      id={padData.representation}
      className={handleClassName}
      style={handleStyle}
    >
      <span className="gst-audit-pad-handle__text">{padData.name}</span>
    </Handle>
  );
};

export default PadHandle;