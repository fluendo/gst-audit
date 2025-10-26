/**
 * GstAudit Component Abstraction Layer
 * Wraps GStreamer objects for React Flow visualization
 */

import { Node, Edge } from '@xyflow/react';
import { GstElement, GstBin, GstPipeline, GObjectValue, Pointer } from './gst';

/**
 * Base class for GStreamer elements in the audit visualization
 * Wraps a GstElement and provides ReactFlow node representation
 */
export class GAElement {
  protected element: GstElement;
  
  constructor(element: GstElement) {
    this.element = element;
  }
  
  /**
   * Get the underlying GstElement
   */
  getElement(): GstElement {
    return this.element;
  }
  
  /**
   * Get the element's name
   */
  async getName(): Promise<string> {
    return await this.element.get_name();
  }
  
  /**
   * Convert this element to a ReactFlow node
   */
  async toNode(position: { x: number; y: number }): Promise<Node> {
    const name = await this.getName();
    const ptr = this.element.ptr;
    
    return {
      id: ptr,
      data: { label: name },
      position,
    };
  }
}

/**
 * Wrapper for GstBin that iterates all inner elements
 * Extends GAElement to inherit base functionality
 */
export class GABin extends GAElement {
  protected bin: GstBin;
  
  constructor(bin: GstBin) {
    super(bin);
    this.bin = bin;
  }
  
  /**
   * Get the underlying GstBin
   */
  getBin(): GstBin {
    return this.bin;
  }
  
  /**
   * Iterate over all elements in the bin and create GAElement instances
   */
  async iterateElements(): Promise<GAElement[]> {
    const elements: GAElement[] = [];
    const iterator = await this.bin.iterate_elements();
    
    try {
      // Use foreach to iterate through all elements
      await iterator.foreach((item: GObjectValue) => {
        // The item is a GObjectValue containing an element
        // We need to extract the element from the GObject Value
        // GObjectValue has a ptr property that points to the actual object
        if (item && item.ptr) {
          // Create a GstElement from the pointer
          const element = new GstElement(item.ptr);
          const gaElement = new GAElement(element);
          elements.push(gaElement);
        }
      });
    } catch (error) {
      console.error('Error iterating elements:', error);
    }
    
    return elements;
  }
  
  /**
   * Convert this bin and all its elements to ReactFlow nodes and edges
   */
  async toNodesAndEdges(): Promise<{ nodes: Node[]; edges: Edge[] }> {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Get all child elements
    const elements = await this.iterateElements();
    
    // Create nodes for each element
    // Position them in a simple grid layout
    const gridSpacing = { x: 200, y: 150 };
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const position = {
        x: 100 + (i % 3) * gridSpacing.x,
        y: 100 + Math.floor(i / 3) * gridSpacing.y,
      };
      const node = await element.toNode(position);
      nodes.push(node);
      
      // Create edges between sequential elements
      // In a real implementation, we would query the actual pad connections
      if (i > 0) {
        edges.push({
          id: `e${elements[i - 1].getElement().ptr}-${element.getElement().ptr}`,
          source: elements[i - 1].getElement().ptr,
          target: element.getElement().ptr,
        });
      }
    }
    
    return { nodes, edges };
  }
}

/**
 * Wrapper for GstPipeline
 * Extends GABin since a pipeline is a special type of bin
 */
export class GAPipeline extends GABin {
  protected pipeline: GstPipeline;
  
  constructor(pipeline: GstPipeline) {
    super(pipeline);
    this.pipeline = pipeline;
  }
  
  /**
   * Get the underlying GstPipeline
   */
  getPipeline(): GstPipeline {
    return this.pipeline;
  }
  
  /**
   * Create a GAPipeline from a pipeline pointer
   */
  static fromPointer(ptr: Pointer): GAPipeline {
    const pipeline = new GstPipeline(ptr);
    return new GAPipeline(pipeline);
  }
}
