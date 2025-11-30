import { useState, useEffect } from 'react';
import { GstElement, GstPad, GstPadTemplate } from '@/lib/gst';

interface UsePadsReturn {
  padtemplates: GstPadTemplate[];
  loading: boolean;
  error: string | null;
}

export function usePads(
  element: GstElement,
  onPadAdded?: (elementId: string, element: GstElement, pad: GstPad) => void,
  onPadRemoved?: (elementId: string, element: GstElement, pad: GstPad) => void
): UsePadsReturn {
  const [padtemplates, setPadtemplates] = useState<GstPadTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPads = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const elementId = element.ptr;
        
        // Get all pads from the element
        const iterator = await element.iterate_pads();
        
        for await (const obj of iterator) {
          try {
            const pad: GstPad = await obj.castTo(GstPad);
            // Call onPadAdded for each pad found
            onPadAdded?.(elementId, element, pad);
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
        
        setPadtemplates(templateArray);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching pads:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPads();
  }, [element, onPadAdded, onPadRemoved]);

  return {
    padtemplates,
    loading,
    error
  };
}