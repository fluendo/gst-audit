import { useState, useCallback } from 'react';
import { GstElement, GstPad, GstPadDirection } from '@/lib/gst';

interface UseSinkSrcPadsReturn {
  sinkPads: GstPad[];
  srcPads: GstPad[];
  handlePadAdded: (elementId: string, element: GstElement, pad: GstPad) => Promise<void>;
  handlePadRemoved: (elementId: string, element: GstElement, pad: GstPad) => void;
}

export function useSinkSrcPads(): UseSinkSrcPadsReturn {
  const [sinkPads, setSinkPads] = useState<GstPad[]>([]);
  const [srcPads, setSrcPads] = useState<GstPad[]>([]);
  
  const handlePadAdded = useCallback(async (elementId: string, element: GstElement, pad: GstPad) => {
    const direction = await pad.get_direction();
    
    if (direction === GstPadDirection.SINK) {
      setSinkPads(prev => {
        if (prev.some(p => p.ptr === pad.ptr)) return prev;
        return [...prev, pad];
      });
    } else if (direction === GstPadDirection.SRC) {
      setSrcPads(prev => {
        if (prev.some(p => p.ptr === pad.ptr)) return prev;
        return [...prev, pad];
      });
    }
  }, []);
  
  const handlePadRemoved = useCallback((elementId: string, element: GstElement, pad: GstPad) => {
    setSinkPads(prev => prev.filter(p => p.ptr !== pad.ptr));
    setSrcPads(prev => prev.filter(p => p.ptr !== pad.ptr));
  }, []);
  
  return {
    sinkPads,
    srcPads,
    handlePadAdded,
    handlePadRemoved
  };
}
