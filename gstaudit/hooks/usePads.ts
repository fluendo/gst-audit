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
      const startTime = performance.now();
      console.log('[USEPADS] Starting pad fetch for element', element.ptr);
      try {
        setLoading(true);
        setError(null);
        
        const elementId = element.ptr;
        
        // Get all pads from the element
        const iteratorStart = performance.now();
        const iterator = await element.iterate_pads();
        const iteratorEnd = performance.now();
        console.log(`[TIMING] iterate_pads() took ${(iteratorEnd - iteratorStart).toFixed(2)}ms`);
        
        let padCount = 0;
        for await (const obj of iterator) {
          if (!obj) continue;
          const padStart = performance.now();
          try {
            const pad: GstPad = await obj.castTo(GstPad);
            // Call onPadAdded for each pad found
            const callbackStart = performance.now();
            onPadAdded?.(elementId, element, pad);
            const callbackEnd = performance.now();
            console.log(`[TIMING] onPadAdded call ${padCount + 1} took ${(callbackEnd - callbackStart).toFixed(2)}ms`);
            padCount++;
          } catch (err) {
            console.error('Error processing pad:', err);
          }
          const padEnd = performance.now();
          console.log(`[TIMING] Processing pad ${padCount} took ${(padEnd - padStart).toFixed(2)}ms`);
        }
        
        console.log(`[USEPADS] Processed ${padCount} pads for element ${element.ptr}`);
        
        // Get pad templates
        const templatesStart = performance.now();
        const templates = await element.get_pad_template_list();
        const templateArray: GstPadTemplate[] = [];
        for await (const template of templates) {
          templateArray.push(template);
        }
        const templatesEnd = performance.now();
        console.log(`[TIMING] get_pad_template_list() took ${(templatesEnd - templatesStart).toFixed(2)}ms`);
        
        setPadtemplates(templateArray);
        
        const totalTime = performance.now() - startTime;
        console.log(`[TIMING] Total usePads fetchPads took ${totalTime.toFixed(2)}ms for element ${element.ptr}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching pads:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPads();
  }, [element]);

  return {
    padtemplates,
    loading,
    error
  };
}
