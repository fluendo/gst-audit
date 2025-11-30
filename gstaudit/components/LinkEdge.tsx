import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  Position,
  MarkerType,
  BaseEdge,
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
  // Adjust coordinates for internal pad connections
  // Internal connections flow left-to-right within a group (opposite of normal external flow)
  const theme = getTheme();
  const padWidth = theme.pad.width;
  
  let adjustedSourceX = sourceX;
  let adjustedSourceY = sourceY;
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;
  let adjustedSourcePosition = sourcePosition;
  let adjustedTargetPosition = targetPosition;
  
  // For internal connections: source is on Left
  if (sourcePosition === Position.Left) {
    adjustedSourcePosition = Position.Right;
    // Move source to the right boundary of the pad (add pad width)
    adjustedSourceX = sourceX + padWidth;
  }
  
  // For internal connections: target is on Right
  if (targetPosition === Position.Right) {
    adjustedTargetPosition = Position.Left;
    // Move target to the left boundary of the pad (subtract pad width)
    adjustedTargetX = targetX - padWidth;
  }
  
  // Get edge path
  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition: adjustedSourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition: adjustedTargetPosition,
  });

  return (
    <>
      <defs>
        <marker
          id="link-edge-arrow"
          markerWidth="12"
          markerHeight="12"
          viewBox="-10 -10 20 20"
          orient="auto"
          refX="0"
          refY="0"
        >
          <polyline
            stroke="var(--color-edge)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill="var(--color-edge)"
            points="-5,-4 0,0 -5,4 -5,-4"
          />
        </marker>
      </defs>
      <BaseEdge 
        path={edgePath} 
        markerEnd="url(#link-edge-arrow)"
      />
    </>
  );
};

export default LinkEdge;