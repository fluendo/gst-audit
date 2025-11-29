import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  Position,
} from '@xyflow/react';
import { getTheme } from '@/lib/theme';

export const LinkEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  // Adjust coordinates to account for pad handle positioning
  // Pads are positioned with offsetFromBorder distance from the element edge
  // The connection point should be at the center of the pad handle
  const theme = getTheme();
  const padOffset = theme.pad.offsetFromBorder;
  const padWidth = theme.pad.width;
  
  let adjustedSourceX = sourceX;
  let adjustedTargetX = targetX;
  
  // If source is on the left (sink pad acting as source for internal connections)
  // add the offset + half pad width to get to center of pad
  if (sourcePosition === Position.Left) {
    adjustedSourceX = sourceX + padOffset + (padWidth / 2);
  }
  // If source is on the right (normal source pad)
  // subtract the offset + half pad width to get to center of pad
  else if (sourcePosition === Position.Right) {
    adjustedSourceX = sourceX - padOffset - (padWidth / 2);
  }
  
  // If target is on the left (normal sink pad)
  // add the offset + half pad width to get to center of pad
  if (targetPosition === Position.Left) {
    adjustedTargetX = targetX + padOffset + (padWidth / 2);
  }
  // If target is on the right (source pad acting as target for internal connections)
  // subtract the offset + half pad width to get to center of pad
  else if (targetPosition === Position.Right) {
    adjustedTargetX = targetX - padOffset - (padWidth / 2);
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
        id="link-edge"
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="arrowclosed"
      />
    </>
  );
};

export default LinkEdge;