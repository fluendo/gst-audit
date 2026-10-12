import {
  GstPipeline,
  GstBin,
  GstElement,
  GstPad,
  GstGhostPad,
  GstPadDirection,
  GstPadDirectionValue,
} from './gst';

// Status callback type for reporting progress
export type StatusCallback = (message: string) => void;

export interface ElementPad {
  id: string; // ptr of the GstPad
  representation: string; // Handle ID for UI (e.g., "element-pad" or "element-ghostpad-internalpad")
  name: string;
  pad: GstPad;
  direction: GstPadDirectionValue;
  isGhost: boolean;
  isInternal: boolean;
  linkedTo: GstPad | null; // Peer pad if linked
  internal: ElementPad | null; // Reference to internal pad (only set for ghost pads)
}

// Tree structure for hierarchical elements
export interface ElementTree {
  id: string;
  name: string;
  element: GstElement;
  parent: ElementTree | null;
  children: ElementTree[];
  pads: ElementPad[];
  level: number; // Hierarchy level (0 for root)
}

export class ElementTreeManager {
  private root: ElementTree | null = null;
  private statusCallback: StatusCallback | null = null;

  /**
   * Set a callback to be notified of status updates during tree generation
   */
  setStatusCallback(callback: StatusCallback | null): void {
    this.statusCallback = callback;
  }

  /**
   * Report status update if callback is set
   */
  private reportStatus(message: string): void {
    if (this.statusCallback) {
      this.statusCallback(message);
    }
  }

  async generateTree(pipeline: GstPipeline): Promise<void> {
    console.log('========================================');
    console.log('[LOAD] Starting pipeline load');
    console.log('========================================');
    this.reportStatus('Loading pipeline...');
    const startTime = performance.now();
    
    try {
      // Walk pipeline recursively and build element tree
      console.log('[ELEMENT_TREE] Walking pipeline structure...');
      this.reportStatus('Walking pipeline structure...');
      const tree = await this.walkPipelineRecursive(pipeline, null, 0);
      this.root = tree;
      
      const totalTime = (performance.now() - startTime).toFixed(2);
      
      // Calculate statistics
      const flatTree = this.getFlatTree();
      const elementCount = flatTree.length;
      const padCount = flatTree.reduce((sum: number, node: ElementTree) => sum + node.pads.length, 0);
      
      console.log('========================================');
      console.log(`[LOAD] Pipeline loaded successfully:`);
      console.log(`[LOAD] - Total time: ${totalTime}ms`);
      console.log(`[LOAD] - Elements: ${elementCount}`);
      console.log(`[LOAD] - Pads: ${padCount}`);
      console.log('========================================');
      
      const message = `Pipeline loaded: ${totalTime}ms - ${elementCount} elements, ${padCount} pads`;
      console.log(`[ELEMENT_TREE] ${message}`);
      this.reportStatus(message);
    } catch (error) {
      console.error('[ELEMENT_TREE] Error during tree generation:', error);
      this.reportStatus(`Error during tree generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Get the root tree
   */
  getRoot(): ElementTree | null {
    return this.root;
  }

  /**
   * Get a flat list of all elements in the tree
   */
  getFlatTree(): ElementTree[] {
    if (!this.root) return [];
    
    const flat: ElementTree[] = [];
    this.flattenTree(this.root, flat);
    return flat;
  }

  /**
   * Get an element by ID
   */
  getElementById(id: string): ElementTree | null {
    if (!this.root) return null;
    return this.findElementById(this.root, id);
  }

  /**
   * Clear the tree
   */
  clear(): void {
    this.root = null;
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  /**
   * Helper to flatten tree into array
   */
  private flattenTree(node: ElementTree, result: ElementTree[]): void {
    result.push(node);
    for (const child of node.children) {
      this.flattenTree(child, result);
    }
  }

  /**
   * Helper to find an element by ID in the tree
   */
  private findElementById(node: ElementTree, id: string): ElementTree | null {
    if (node.id === id) {
      return node;
    }
    for (const child of node.children) {
      const found = this.findElementById(child, id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Recursively walk the pipeline/bin structure and create element tree
   */
  private async walkPipelineRecursive(
    element: GstElement,
    parent: ElementTree | null,
    level: number
  ): Promise<ElementTree> {
    const elementStart = performance.now();
    
    // Get element name
    const elementName = (await element.get_name()) ?? 'unknown';
    
    // Report status
    this.reportStatus(`Processing ${elementName}...`);
    
    // Discover all pads and check if this is a bin
    const [pads, isGstBin] = await Promise.all([
      this.discoverPads(element, elementName),
      element.isOf(GstBin),
    ]);

    console.log(`[ELEMENT_TREE] Processing ${isGstBin ? 'bin' : 'element'}: ${elementName} (${pads.filter(p => p.direction === GstPadDirection.SINK).length} sink, ${pads.filter(p => p.direction === GstPadDirection.SRC).length} src pads)`);
    
    // Create tree node
    const treeNode: ElementTree = {
      id: element.ptr,
      name: elementName,
      element,
      parent,
      children: [],
      pads,
      level
    };
    
    // If it's a bin, recursively process children
    if (isGstBin) {
      const bin = await element.castTo(GstBin);
      const iterator = await bin.iterate_elements();
      
      if (iterator) {
        // Iterate sequentially, then walk the children in parallel
        const objs = [];
        for await (const obj of iterator) {
          if (obj) objs.push(obj);
        }
        treeNode.children = await Promise.all(objs.map(async (obj) => {
          const child = await obj.castTo(GstElement);
          return this.walkPipelineRecursive(child, treeNode, level + 1);
        }));
      }
    }
    
    console.log(`[ELEMENT_TREE] Element ${elementName} processed in ${(performance.now() - elementStart).toFixed(2)}ms`);
    
    return treeNode;
  }

  /**
   * Discover all pads for an element
   */
  private async discoverPads(element: GstElement, elementName: string): Promise<ElementPad[]> {
    const iterator = await element.iterate_pads();
    
    // Iterate sequentially, then query the pads in parallel
    const objs = [];
    for await (const obj of iterator) {
      if (obj) objs.push(obj);
    }

    const pads = await Promise.all(objs.map(async (obj): Promise<ElementPad> => {
      const pad = await obj.castTo(GstPad);
      const [name, direction, isGhost, isLinked] = await Promise.all([
        pad.get_name(),
        pad.get_direction(),
        pad.isOf(GstGhostPad),
        pad.is_linked(),
      ]);
      const padName = name ?? 'unknown';
      const linkedTo = isLinked ? await pad.get_peer() : null;
      
      // Initialize internal pad reference as null
      let internalPad: ElementPad | null = null;
      
      // If this is a ghost pad, create the internal pad object
      if (isGhost) {
        try {
          const ghostPad = await pad.castTo(GstGhostPad);
          const internal = await ghostPad.get_internal();
          if (internal) {
            const [internalNameOrNull, internalIsLinked] = await Promise.all([
              internal.get_name(),
              internal.is_linked(),
            ]);
            const internalName = internalNameOrNull ?? 'unknown';
            // Internal pad representation should match the same format: elementName-padName
            const internalRepresentation = `${elementName}-${padName}-${internalName}`;
            
            // Internal pad direction is opposite of ghost pad direction
            const internalDirection = direction === GstPadDirection.SINK ? GstPadDirection.SRC : GstPadDirection.SINK;
            
            const internalLinkedTo = internalIsLinked ? await internal.get_peer() : null;
            
            // Create the internal pad object (will be nested, not added to main array)
            internalPad = {
              id: internal.ptr,
              representation: internalRepresentation,
              name: internalName,
              pad: internal,
              direction: internalDirection, // Opposite direction of ghost pad
              isGhost: false,
              isInternal: true,
              linkedTo: internalLinkedTo,
              internal: null // Internal pads don't have their own internal pads
            };
          }
        } catch (err) {
          console.error('Error getting ghost pad internal:', err);
        }
      }
      
      // Add the pad with internal reference
      const representation = `${elementName}-${padName}`;
      return {
        id: pad.ptr,
        representation,
        name: padName,
        pad,
        direction,
        isGhost,
        isInternal: false,
        linkedTo,
        internal: internalPad // Set the internal pad reference (null for non-ghost pads)
      };
    }));
    
    return pads;
  }
}

