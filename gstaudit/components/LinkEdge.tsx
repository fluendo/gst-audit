import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  Position,
} from '@xyflow/react';
import type { PadConnectionInfo } from './types';
import { GstPad, GstPadDirection, GstGhostPad } from '@/lib/gst';

export const LinkEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgeStyle, setEdgeStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    const determineEdgeStyle = () => {
      // Access the connection info from data (cast from unknown)
      const connection = data as unknown as PadConnectionInfo;
      
      if (!connection) {
        setEdgeStyle({});
        return;
      }

      let strokeDasharray: string | undefined;
      let strokeWidth: number = 2;
      let stroke: string | undefined;

      if (connection.isInternal) {
        // Internal connection (ghost pad's internal pad to/from internal element)
        strokeDasharray = '5,5';
        strokeWidth = 1.5;
        stroke = '#9ca3af'; // gray-400
      } else {
        // Normal pad to normal pad or external ghost pad connections
        strokeWidth = 2;
        stroke = '#10b981'; // green-500
      }

      setEdgeStyle({
        strokeDasharray,
        strokeWidth,
        stroke,
      });
    };

    determineEdgeStyle();
  }, [data]);

  // Adjust coordinates to account for internal handle positioning
  // Internal handles are offset by 10px inside the container
  let adjustedSourceX = sourceX;
  let adjustedTargetX = targetX;
  
  // If source is on the right (internal source pad), move it 10px to the left
  if (sourcePosition === Position.Left) {
    adjustedSourceX = sourceX + 68;
  }
  
  // If target is on the left (internal sink pad), move it 10px to the right  
  if (targetPosition === Position.Right) {
    adjustedTargetX = targetX - 68;
  } else {
    adjustedTargetX = targetX;
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
        markerEnd={markerEnd}
        style={edgeStyle}
      />
    </>
  );
};

export default LinkEdge;