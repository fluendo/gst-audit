/**
 * Pipeline Component - Renders a GStreamer Pipeline
 */

import { useEffect, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { GstPipeline, Pointer } from '@/lib/gst';
import { Bin } from './Bin';

interface PipelineProps {
  pipelinePtr: Pointer;
  onPipelineReady?: (name: string, nodes: Node[], edges: Edge[]) => void;
}

export function Pipeline({ pipelinePtr, onPipelineReady }: PipelineProps) {
  const [pipeline, setPipeline] = useState<GstPipeline | null>(null);
  const [pipelineName, setPipelineName] = useState<string>('');

  useEffect(() => {
    const loadPipeline = async () => {
      try {
        const gstPipeline = new GstPipeline(pipelinePtr);
        setPipeline(gstPipeline);
        
	console.error("About to get name in pipeline");
        const name = await gstPipeline.get_name();
        setPipelineName(name);
      } catch (error) {
        console.error('Error loading pipeline:', error);
      }
    };
    
    loadPipeline();
  }, [pipelinePtr]);

  const handleNodesReady = (nodes: Node[], edges: Edge[]) => {
    if (onPipelineReady) {
      onPipelineReady(pipelineName, nodes, edges);
    }
  };

  // Render Bin component which handles the pipeline's elements
  // GstPipeline extends GstBin, so we can use it as a bin
  return pipeline ? <Bin bin={pipeline} onNodesReady={handleNodesReady} /> : null;
}
