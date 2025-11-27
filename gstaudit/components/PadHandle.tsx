import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GstPad, GstPadDirection, GstPadDirectionValue, GstGhostPad } from '@/lib/gst';

interface ContainerDimensions {
  width: number;
  height: number;
  headerHeight: number;
}

interface PadHandleProps {
  pad: GstPad;
  index: number;
  count: number;
  containerDimensions: ContainerDimensions;
}

interface PadInfo {
  name: string;
  direction: GstPadDirectionValue;
  id: string;
  isGhost: boolean;
  internalName?: string;
}

const PadHandle: React.FC<PadHandleProps> = ({
  pad,
  index,
  count,
  containerDimensions
}) => {
  const [padInfo, setPadInfo] = useState<PadInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPadInfo = async () => {
      try {
        const name = await pad.get_name();
        const direction = await pad.get_direction();
        const parent = await pad.get_parent();
        const elementName = parent ? await parent.get_name() : 'unknown';
        const id = `${elementName}-${name}`;
        
        // Check if this is a ghost pad
        const isGhost = await pad.isOf(GstGhostPad);
        let internalName: string | undefined;
        
        if (isGhost) {
          try {
            const ghostPad = await pad.castTo(GstGhostPad);
            const internal = await ghostPad.get_internal();
            if (internal) {
              internalName = await internal.get_name();
            }
          } catch (err) {
            console.error('Error getting ghost pad internal:', err);
          }
        }

        setPadInfo({
          name,
          direction,
          id,
          isGhost,
          internalName
        });
      } catch (error) {
        console.error('Error fetching pad info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPadInfo();
  }, [pad]);

  if (loading || !padInfo) {
    return null; // Don't render anything while loading
  }

  // Calculate pad position
  const { width, height, headerHeight } = containerDimensions;
  const availableHeight = height - headerHeight - 20; // Account for padding

  // Use consistent formula: distribute evenly using (index + 1) / (count + 1)
  const padPosition = headerHeight + ((index + 1) * availableHeight / (count + 1));

  // Determine handle properties based on direction
  const isSink = padInfo.direction === GstPadDirection.SINK;
  const handleType = isSink ? 'target' : 'source';
  const position = isSink ? Position.Left : Position.Right;
  const backgroundColor = isSink ? '#ef4444' : '#22c55e'; // Red for sink, green for source

  return (
    <React.Fragment>
      {/* Main Handle (ghost or regular) */}
      <Handle
        type={handleType}
        position={position}
        id={padInfo.id}
        style={{
          top: padPosition,
          backgroundColor,
          width: 8,
          height: 8,
          border: '1px solid #1f2937',
          zIndex: 10
        }}
      />
      
      {/* Ghost pad internal handle */}
      {padInfo.isGhost && padInfo.internalName && (
        <Handle
          type={isSink ? 'source' : 'target'} // Opposite type for internal
          position={position}
          id={`${padInfo.name}-${padInfo.internalName}`}
          style={{
            top: padPosition,
            [isSink ? 'left' : 'right']: 10, // Position inside the container
            backgroundColor: '#3b82f6', // Blue for internal
            width: 8,
            height: 8,
            border: '1px solid #1f2937',
            borderRadius: '50%',
            zIndex: 9
          }}
        />
      )}
      
      {/* Pad Label */}
      <div
        className="absolute text-xs"
        style={{
          [isSink ? 'left' : 'right']: 12,
          top: padPosition - 4, // Center text with handle
          fontSize: '10px',
          textAlign: isSink ? 'left' : 'right',
          color: '#374151',
          zIndex: 5
        }}
      >
        {padInfo.name}
      </div>
    </React.Fragment>
  );
};

export default PadHandle;