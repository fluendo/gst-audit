import { useState, useEffect, useCallback } from 'react';
import { GstElement, GstPad, GstPadTemplate, GstPadDirection } from '@/lib/gst';

interface UsePadsReturn {
  sinkPads: GstPad[];
  srcPads: GstPad[];
  padtemplates: GstPadTemplate[];
  loading: boolean;
  error: string | null;
}

export function usePads(
  element: GstElement
): UsePadsReturn {
  const [sinkPads, setSinkPads] = useState<GstPad[]>([]);
  const [srcPads, setSrcPads] = useState<GstPad[]>([]);
  const [padtemplates, setPadtemplates] = useState<GstPadTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPads = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const sinkPadList: GstPad[] = [];
      const srcPadList: GstPad[] = [];
      
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

  return {
    sinkPads,
    srcPads,
    padtemplates,
    loading,
    error
  };
}