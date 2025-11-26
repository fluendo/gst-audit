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
  element: GstElement
): UsePadsReturn {
  const [sinkPads, setSinkPads] = useState<GstPad[]>([]);
  const [srcPads, setSrcPads] = useState<GstPad[]>([]);
  const [padtemplates, setPadtemplates] = useState<GstPadTemplate[]>([]);
  const [connections, setConnections] = useState<PadConnectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  console.error(`Pads loaded: ${sinkPads.length} sink, ${srcPads.length} src and ${connections.length} connections for element ${element.ptr}`);
  return {
    sinkPads,
    srcPads,
    padtemplates,
    connections,
    loading,
    error
  };
}