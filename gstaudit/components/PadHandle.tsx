import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GstPad, GstPadDirection, GstPadDirectionValue, GstGhostPad, GstElement } from '@/lib/gst';
import type { PadConnectionInfo } from './types';

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
  onConnectionAdded?: (connection: PadConnectionInfo) => void;
  onConnectionRemoved?: (connection: PadConnectionInfo) => void;
}

interface PadInfo {
  name: string;
  direction: GstPadDirectionValue;
  id: string;
  isGhost: boolean;
  internalName?: string;
  elementPtr: string;
  elementName: string;
}

const PadHandle: React.FC<PadHandleProps> = ({
  pad,
  index,
  count,
  containerDimensions,
  onConnectionAdded,
  onConnectionRemoved
}) => {
  const [padInfo, setPadInfo] = useState<PadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use ref to track connection for cleanup
  const connectionRef = useRef<PadConnectionInfo | null>(null);

  useEffect(() => {
    console.log(`🎯 [PadHandle] Effect triggered for pad ${pad.ptr}`);
    const fetchPadInfo = async () => {
      try {
        const name = await pad.get_name();
        const direction = await pad.get_direction();
        const parent = await pad.get_parent();
        const elementName = parent ? await parent.get_name() : 'unknown';
        const elementPtr = parent ? parent.ptr : 'unknown';
        const id = `${elementName}-${name}`;
        
        console.log(`📝 [PadHandle] Pad info fetched: ${id}, direction: ${direction}`);
        
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

        const padInfoData: PadInfo = {
          name,
          direction,
          id,
          isGhost,
          internalName,
          elementPtr,
          elementName
        };
        
        setPadInfo(padInfoData);
        
        // Analyze connection once after padInfo is ready
        console.log(`🔗 [PadHandle] About to analyze connection for ${id}`);
        await analyzeConnection(padInfoData);
      } catch (error) {
        console.error('Error fetching pad info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPadInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad]); // Only run when pad reference changes

  // Analyze pad connections and create connection info
  const analyzeConnection = async (info: PadInfo) => {
    if (!info || !onConnectionAdded) return;

    try {
      const isLinked = await pad.is_linked();
      if (!isLinked) {
        return;
      }

      const peerPad = await pad.get_peer();
      
      // Get the peer pad's parent - could be a GstElement or GstGhostPad
      const peerParent = await peerPad.get_parent();
      let peerElement: GstElement;
      let peerElementPtr: string;
      let peerElementName: string;
      let peerPadName: string;
      
      // Check if peer parent is a ghost pad (internal pad case)
      if (await peerParent.isOf(GstGhostPad)) {
        // The peer is an internal pad of a ghost pad
        const ghostPad = await peerParent.castTo(GstGhostPad);
        const ghostParent = await ghostPad.get_parent();
        peerElement = await ghostParent.castTo(GstElement);
        peerElementPtr = peerElement.ptr;
        peerElementName = await peerElement.get_name();
        
        // For ghost pads, use the ghost pad name, not the internal pad name
        peerPadName = await ghostPad.get_name();
      } else {
        // Normal case - peer parent is directly a GstElement
        peerElement = await peerParent.castTo(GstElement);
        peerElementPtr = peerElement.ptr;
        peerElementName = await peerElement.get_name();
        peerPadName = await peerPad.get_name();
      }
      
      const currentHandleId = info.id;
      const peerHandleId = `${peerElementName}-${peerPadName}`;
      
      // Only create connections for source pads to avoid duplicates
      // (each connection will be created once by the source pad)
      if (info.direction === GstPadDirection.SRC) {
        const connectionInfo: PadConnectionInfo = {
          sourceNodeId: info.elementPtr,
          targetNodeId: peerElementPtr,
          sourceHandleId: currentHandleId,
          targetHandleId: peerHandleId,
          sourcePadPtr: pad.ptr,
          targetPadPtr: peerPad.ptr,
          reportedBy: 'source'
        };
        
        connectionRef.current = connectionInfo;
        
        // Schedule callback to avoid state updates during render
        setTimeout(() => {
          onConnectionAdded(connectionInfo);
        }, 0);
      } else if (info.direction === GstPadDirection.SINK) {
        // Sink pads also report their connections for validation
        const connectionInfo: PadConnectionInfo = {
          sourceNodeId: peerElementPtr,
          targetNodeId: info.elementPtr,
          sourceHandleId: peerHandleId,
          targetHandleId: currentHandleId,
          sourcePadPtr: peerPad.ptr,
          targetPadPtr: pad.ptr,
          reportedBy: 'target'
        };
        
        connectionRef.current = connectionInfo;
        
        // Schedule callback to avoid state updates during render
        setTimeout(() => {
          onConnectionAdded(connectionInfo);
        }, 0);
      }
    } catch (err) {
      console.error('Error analyzing connection:', err);
    }
  };

  // Effect to cleanup connection on unmount ONLY
  useEffect(() => {
    return () => {
      if (connectionRef.current && onConnectionRemoved) {
        // Schedule callback to avoid state updates during render
        setTimeout(() => {
          onConnectionRemoved(connectionRef.current!);
        }, 0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only runs on mount/unmount

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