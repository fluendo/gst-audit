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
    const fetchPadInfo = async () => {
      try {
        const name = await pad.get_name();
        const direction = await pad.get_direction();
        const parent = await pad.get_parent();
        const elementName = parent ? await parent.get_name() : 'unknown';
        const elementPtr = parent ? parent.ptr : 'unknown';
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
        await analyzeConnection(padInfoData);
      } catch (error) {
        console.error('Error fetching pad info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPadInfo();
  }, [pad]);

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
        
        // For ghost pads, construct the internal pad handle ID (triple name format)
        const ghostPadName = await ghostPad.get_name();
        const internalPadName = await peerPad.get_name();
        peerPadName = `${ghostPadName}-${internalPadName}`;
      } else {
        // Normal case - peer parent is directly a GstElement
        peerElement = await peerParent.castTo(GstElement);
        peerElementPtr = peerElement.ptr;
        peerElementName = await peerElement.get_name();
        peerPadName = await peerPad.get_name();
      }
      
      const currentHandleId = info.id;
      const peerHandleId = `${peerElementName}-${peerPadName}`;
      
      // Determine connection direction and reportedBy based on pad direction
      const isSrc = info.direction === GstPadDirection.SRC;
      const connectionInfo: PadConnectionInfo = {
        sourceNodeId: isSrc ? info.elementPtr : peerElementPtr,
        targetNodeId: isSrc ? peerElementPtr : info.elementPtr,
        sourceHandleId: isSrc ? currentHandleId : peerHandleId,
        targetHandleId: isSrc ? peerHandleId : currentHandleId,
        sourcePadPtr: isSrc ? pad.ptr : peerPad.ptr,
        targetPadPtr: isSrc ? peerPad.ptr : pad.ptr,
        reportedBy: isSrc ? 'source' : 'target',
        isInternal: false // External connection (ghost or regular pad to external element)
      };
      
      connectionRef.current = connectionInfo;
      
      // Schedule callback to avoid state updates during render
      setTimeout(() => {
        onConnectionAdded?.(connectionInfo);
      }, 0);
      
      // If this is a ghost pad, also emit the internal connection
      if (info.isGhost && info.internalName) {
        try {
          const ghostPad = await pad.castTo(GstGhostPad);
          const internalPad = await ghostPad.get_internal();
          const internalPeer = await internalPad.get_peer();
          
          if (internalPeer) {
            const internalPeerParent = await internalPeer.get_parent();
            const internalPeerElement = await internalPeerParent.castTo(GstElement);
            const internalPeerElementPtr = internalPeerElement.ptr;
            const internalPeerElementName = await internalPeerElement.get_name();
            const internalPeerPadName = await internalPeer.get_name();
            
            // Use the internal pad handle ID (triple name format)
            const internalHandleId = `${info.elementName}-${info.name}-${info.internalName}`;
            const internalPeerHandleId = `${internalPeerElementName}-${internalPeerPadName}`;
            
            // For ghost pads:
            // - SINK ghost pad: internal connection flows FROM internal pad TO internal element (ghost acts as source)
            // - SRC ghost pad: internal connection flows FROM internal element TO internal pad (ghost acts as target)
            const internalConnectionInfo: PadConnectionInfo = {
              sourceNodeId: isSrc ? internalPeerElementPtr : info.elementPtr,
              targetNodeId: isSrc ? info.elementPtr : internalPeerElementPtr,
              sourceHandleId: isSrc ? internalPeerHandleId : internalHandleId,
              targetHandleId: isSrc ? internalHandleId : internalPeerHandleId,
              sourcePadPtr: isSrc ? internalPeer.ptr : internalPad.ptr,
              targetPadPtr: isSrc ? internalPad.ptr : internalPeer.ptr,
              reportedBy: isSrc ? 'target' : 'source',
              isInternal: true // Internal connection (ghost pad's internal pad to/from internal element)
            };
            
            setTimeout(() => {
              onConnectionAdded?.(internalConnectionInfo);
            }, 0);
          }
        } catch (err) {
          console.error('Error analyzing ghost pad internal connection:', err);
        }
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
          onConnectionRemoved?.(connectionRef.current!);
        }, 0);
      }
    };
  }, []);

  // Don't render anything while loading
  if (loading || !padInfo) {
    return null;
  }

  // Calculate pad position
  const { width, height, headerHeight } = containerDimensions;
  // Available height is the area below the header
  const availableHeight = height - headerHeight;

  // Use consistent formula: distribute evenly using (index + 1) / (count + 1)
  const padPosition = headerHeight + ((index + 1) * availableHeight / (count + 1));

  // Determine handle properties based on direction
  const isSink = padInfo.direction === GstPadDirection.SINK;
  const handleType = isSink ? 'target' : 'source';
  const position = isSink ? Position.Left : Position.Right;
  const handleClassName = isSink ? 'gst-audit-pad-handle gst-audit-pad-handle--sink' : 'gst-audit-pad-handle gst-audit-pad-handle--src';

  // If this is a ghost pad, we need to stack both pads vertically
  const isGhost = padInfo.isGhost && padInfo.internalName;
  const containerHeight = isGhost ? 50 : 20; // Taller container for stacked pads
  
  // Handles don't need positioning - flexbox in container handles it
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
        id={padInfo.id}
        className={handleClassName}
        style={handleStyle}
      >
        {padInfo.name}
      </Handle>
      
      {/* Ghost pad internal handle - positioned below the ghost pad */}
      {isGhost && (
        <Handle
          type={isSink ? 'source' : 'target'} // Opposite type for internal
          position={position}
          id={`${padInfo.elementName}-${padInfo.name}-${padInfo.internalName}`}
          className="gst-audit-pad-handle gst-audit-pad-handle--internal"
          style={internalHandleStyle}
        >
          {padInfo.internalName}
        </Handle>
      )}
    </div>
  );
};

export default PadHandle;