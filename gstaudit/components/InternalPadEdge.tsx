import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  Position,
} from '@xyflow/react';

interface InternalPadEdgeProps extends EdgeProps {
  // Additional props for internal pad edge customization
}

export const InternalPadEdge: React.FC<InternalPadEdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Adjust coordinates to account for internal handle positioning
  // Internal handles are offset by 10px inside the container
  let adjustedSourceX = sourceX;
  let adjustedTargetX = targetX;
  
  // If source is on the right (internal source pad), move it 10px to the left
  if (sourcePosition === Position.Left) {
    adjustedSourceX = sourceX + 10;
  }
  
  // If target is on the left (internal sink pad), move it 10px to the right  
  if (targetPosition === Position.Right) {
    adjustedTargetX = targetX - 10;
  }
  
  // For internal pad connections, we want a more controlled path
  // that doesn't curve outside the group boundaries
  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX: adjustedTargetX,
    targetY,
    targetPosition: Position.Left,
  });

  return (
    <>
      <path
        id="internal-pad-edge"
        style={{
          ...style,
          strokeDasharray: '5,5', // Dashed line to indicate internal connection
          stroke: '#0ea5e9',
          strokeWidth: 2,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default InternalPadEdge;