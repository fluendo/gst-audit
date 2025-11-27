import { useState, useEffect, useCallback } from 'react';
import { GstElement, GstPad, GstPadTemplate, GstPadDirection, GstPadDirectionValue, GstGhostPad } from '@/lib/gst';
import type { PadConnectionInfo } from '@/components/types';

interface UsePadsReturn {
  sinkPads: GstPad[];
  srcPads: GstPad[];
  padtemplates: GstPadTemplate[];
  connections: PadConnectionInfo[];
  loading: boolean;
  error: string | null;
}

export function usePads(
  element: GstElement,
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void,
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void,
  onConnectionAdded?: (connection: PadConnectionInfo) => void,
  onConnectionRemoved?: (connection: PadConnectionInfo) => void
): UsePadsReturn {
  const [sinkPads, setSinkPads] = useState<GstPad[]>([]);
  const [srcPads, setSrcPads] = useState<GstPad[]>([]);
  const [padtemplates, setPadtemplates] = useState<GstPadTemplate[]>([]);
  const [connections, setConnections] = useState<PadConnectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of previous pad state for comparison
  const [prevSinkPads, setPrevSinkPads] = useState<GstPad[]>([]);
  const [prevSrcPads, setPrevSrcPads] = useState<GstPad[]>([]);
  const [prevConnections, setPrevConnections] = useState<PadConnectionInfo[]>([]);

  const fetchPads = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const sinkPadList: GstPad[] = [];
      const srcPadList: GstPad[] = [];
      const connectionList: PadConnectionInfo[] = [];
      
      // Get element name for handle ID generation
      const elementName = await element.get_name();
      const elementPtr = element.ptr;
      
      // Get all pads from the element
      const iterator = await element.iterate_pads();
      
      for await (const obj of iterator) {
        try {
          const pad: GstPad = await obj.castTo(GstPad);
          const direction = await pad.get_direction();
          
          if (direction === GstPadDirection.SINK) {
            sinkPadList.push(pad);
          } else if (direction === GstPadDirection.SRC) {
            srcPadList.push(pad);
          }
          
          // Check for connections while we're iterating
          const isLinked = await pad.is_linked();
          if (isLinked) {
            await analyzeConnection(pad, elementName, elementPtr, direction, connectionList);
          }
        } catch (err) {
          console.error('Error processing pad:', err);
        }
      }
      
      // Get pad templates
      const templates = await element.get_pad_template_list();
      const templateArray: GstPadTemplate[] = [];
      
      for await (const template of templates) {
        templateArray.push(template);
      }
      
      setSinkPads(sinkPadList);
      setSrcPads(srcPadList);
      setPadtemplates(templateArray);
      setConnections(connectionList);
      console.error(`Fetched ${sinkPadList.length} sink pads, ${srcPadList.length} src pads, and ${connectionList.length} connections for element ${elementName}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching pads:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [element]);

  // Helper function to analyze pad connections, handling ghost pads
  const analyzeConnection = async (
    pad: GstPad,
    elementName: string,
    elementPtr: string,
    direction: GstPadDirectionValue,
    connectionList: PadConnectionInfo[]
  ): Promise<void> => {
    try {
      const peerPad = await pad.get_peer();
      const padName = await pad.get_name();
      
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
      
      const currentHandleId = `${elementName}-${padName}`;
      const peerHandleId = `${peerElementName}-${peerPadName}`;
      
      // Create connection based on pad direction
      if (direction === 'src') {
        // Source pad -> any sink (normal case)
        connectionList.push({
          sourceNodeId: elementPtr,
          targetNodeId: peerElementPtr,
          sourceHandleId: currentHandleId,
          targetHandleId: peerHandleId,
          sourcePadPtr: pad.ptr,
          targetPadPtr: peerPad.ptr
        });
      } else if (direction === 'sink') {
        // Sink pad connected to internal src pad (ghost pad case)
        // We need to manually create the connection from the peer to us
        const peerDirection = await peerPad.get_direction();
        if (peerDirection === 'src') {
          connectionList.push({
            sourceNodeId: peerElementPtr,
            targetNodeId: elementPtr,
            sourceHandleId: peerHandleId,
            targetHandleId: currentHandleId,
            sourcePadPtr: peerPad.ptr,
            targetPadPtr: pad.ptr
          });
        }
      }
    } catch (err) {
      console.error('Error analyzing connection:', err);
    }
  };

  useEffect(() => {
    console.error(`useEffect triggered for fetch`);
    fetchPads();
  }, [fetchPads]);

  // Effect to track pad changes and trigger callbacks
  useEffect(() => {
    if (loading || error || (!onPadAdded && !onPadRemoved)) return;

    const elementId = element.ptr;

    // Check for added sink pads
    const addedSinkPads = sinkPads.filter(pad => !prevSinkPads.some(prevPad => prevPad.ptr === pad.ptr));
    addedSinkPads.forEach(pad => {
      // Schedule callback for next render to avoid state updates during render
      setTimeout(() => {
        onPadAdded?.(elementId, element, pad, 'sink');
      }, 0);
    });

    // Check for removed sink pads
    const removedSinkPads = prevSinkPads.filter(pad => !sinkPads.some(currentPad => currentPad.ptr === pad.ptr));
    removedSinkPads.forEach(pad => {
      setTimeout(() => {
        onPadRemoved?.(elementId, element, pad, 'sink');
      }, 0);
    });

    // Check for added src pads
    const addedSrcPads = srcPads.filter(pad => !prevSrcPads.some(prevPad => prevPad.ptr === pad.ptr));
    addedSrcPads.forEach(pad => {
      setTimeout(() => {
        onPadAdded?.(elementId, element, pad, 'src');
      }, 0);
    });

    // Check for removed src pads
    const removedSrcPads = prevSrcPads.filter(pad => !srcPads.some(currentPad => currentPad.ptr === pad.ptr));
    removedSrcPads.forEach(pad => {
      setTimeout(() => {
        onPadRemoved?.(elementId, element, pad, 'src');
      }, 0);
    });

    // Update previous pad state
    setPrevSinkPads(sinkPads);
    setPrevSrcPads(srcPads);
  }, [sinkPads, srcPads, prevSinkPads, prevSrcPads, loading, error, element, onPadAdded, onPadRemoved]);

  // Effect to track connection changes and trigger callbacks
  useEffect(() => {
    if (loading || error || (!onConnectionAdded && !onConnectionRemoved)) return;

    // Check for new connections
    const addedConnections = connections.filter(conn => 
      !prevConnections.some(prevConn => 
        prevConn.sourceNodeId === conn.sourceNodeId &&
        prevConn.targetNodeId === conn.targetNodeId &&
        prevConn.sourceHandleId === conn.sourceHandleId &&
        prevConn.targetHandleId === conn.targetHandleId
      )
    );

    addedConnections.forEach(conn => {
      // Schedule callback for next render to avoid state updates during render
      setTimeout(() => {
        onConnectionAdded?.(conn);
      }, 0);
    });

    // Check for removed connections
    const removedConnections = prevConnections.filter(prevConn => 
      !connections.some(conn => 
        conn.sourceNodeId === prevConn.sourceNodeId &&
        conn.targetNodeId === prevConn.targetNodeId &&
        conn.sourceHandleId === prevConn.sourceHandleId &&
        conn.targetHandleId === prevConn.targetHandleId
      )
    );

    removedConnections.forEach(conn => {
      setTimeout(() => {
        onConnectionRemoved?.(conn);
      }, 0);
    });

    // Update previous connections state
    setPrevConnections(connections);
  }, [connections, prevConnections, loading, error, onConnectionAdded, onConnectionRemoved]);

  return {
    sinkPads,
    srcPads,
    padtemplates,
    connections,
    loading,
    error
  };
}