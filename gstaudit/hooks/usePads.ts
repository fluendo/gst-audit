import { useState, useEffect, useCallback } from 'react';
import { GstElement, GstPad, GstPadTemplate, GstPadDirection, GstPadDirectionValue, GstGhostPad } from '@/lib/gst';
import type { PadConnectionInfo } from '@/components/types';

interface UsePadsReturn {
  sinkPads: GstPad[];
  srcPads: GstPad[];
  padtemplates: GstPadTemplate[];
  loading: boolean;
  error: string | null;
}

export function usePads(
  element: GstElement,
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void,
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad, type: 'sink' | 'src') => void
): UsePadsReturn {
  const [sinkPads, setSinkPads] = useState<GstPad[]>([]);
  const [srcPads, setSrcPads] = useState<GstPad[]>([]);
  const [padtemplates, setPadtemplates] = useState<GstPadTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of previous pad state for comparison
  const [prevSinkPads, setPrevSinkPads] = useState<GstPad[]>([]);
  const [prevSrcPads, setPrevSrcPads] = useState<GstPad[]>([]);

  const fetchPads = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const sinkPadList: GstPad[] = [];
      const srcPadList: GstPad[] = [];
      
      // Get element name for handle ID generation
      const elementName = await element.get_name();
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching pads:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [element]);

  useEffect(() => {
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

  return {
    sinkPads,
    srcPads,
    padtemplates,
    loading,
    error
  };
}