/**
 * Element Component - Renders a GStreamer Element as a ReactFlow node
 */

import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { GstElement } from '@/lib/gst';

interface ElementProps {
  element: GstElement;
  position: { x: number; y: number };
  onNodeReady?: (node: Node) => void;
}

export function Element({ element, position, onNodeReady }: ElementProps) {
  useEffect(() => {
    const loadElement = async () => {
      try {
	console.error("About to get name in element");
        const elementName = await element.get_name();
        
        // Create ReactFlow node
        if (onNodeReady) {
          const node: Node = {
            id: element.ptr,
            data: { label: elementName },
            position,
          };
          onNodeReady(node);
        }
      } catch (error) {
        console.error('Error loading element:', error);
      }
    };
    
    loadElement();
  }, [element, position, onNodeReady]);

  // This component doesn't render UI directly, it's a data component
  return null;
}
