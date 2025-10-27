/**
 * Bin Component - Renders a GStreamer Bin and its child elements
 */

import { useEffect, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { GstBin, GstElement, GObjectValue } from '@/lib/gst';

interface BinProps {
  bin: GstBin;
  onNodesReady?: (nodes: Node[], edges: Edge[]) => void;
}

export function Bin({ bin, onNodesReady }: BinProps) {
  const [elements, setElements] = useState<GstElement[]>([]);

  useEffect(() => {
    const loadElements = async () => {
      try {
        const iterator = await bin.iterate_elements();
        const elementList: GstElement[] = [];
        
        // Iterate through all elements in the bin
        await iterator.foreach((item: GObjectValue) => {
          if (item && item.ptr) {
            const element = new GstElement(item.ptr);
            elementList.push(element);
          }
        });
        
        setElements(elementList);
      } catch (error) {
        console.error('Error loading bin elements:', error);
      }
    };
    
    loadElements();
  }, [bin]);

  useEffect(() => {
    if (elements.length === 0 || !onNodesReady) return;

    const loadNodesAndEdges = async () => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Grid layout for elements
      const gridSpacing = { x: 200, y: 150 };
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const position = {
          x: 100 + (i % 3) * gridSpacing.x,
          y: 100 + Math.floor(i / 3) * gridSpacing.y,
        };
        
        try {
	  console.error("About to get name in bin");
          const name = await element.get_name();
          const node: Node = {
            id: element.ptr,
            data: { label: name },
            position,
          };
          nodes.push(node);
          
          // Create edges between sequential elements
          if (i > 0) {
            edges.push({
              id: `e${elements[i - 1].ptr}-${element.ptr}`,
              source: elements[i - 1].ptr,
              target: element.ptr,
            });
          }
        } catch (error) {
          console.error('Error creating node for element:', error);
        }
      }
      
      onNodesReady(nodes, edges);
    };
    
    loadNodesAndEdges();
  }, [elements, onNodesReady]);

  // This component doesn't render UI directly, it's a data component
  return null;
}
