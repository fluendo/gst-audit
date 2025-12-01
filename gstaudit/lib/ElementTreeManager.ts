import {
  GstPipeline,
  GstBin,
  GstElement,
  GstPad,
  GstGhostPad,
  GstPadDirection,
  GstPadDirectionValue,
} from './gst';

export interface ElementPad {
  id: string; // ptr of the GstPad
  representation: string; // Handle ID for UI (e.g., "element-pad" or "element-ghostpad-internalpad")
  name: string;
  pad: GstPad;
  direction: GstPadDirectionValue;
  isGhost: boolean;
  isInternal: boolean;
  linkedTo: GstPad | null; // Peer pad if linked
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

  async generateTree(pipeline: GstPipeline): Promise<void> {
    console.log('[ELEMENT_TREE] Starting tree generation...');
    const startTime = performance.now();
    
    try {
      // Walk pipeline recursively and build element tree
      console.log('[ELEMENT_TREE] Walking pipeline structure...');
      const tree = await this.walkPipelineRecursive(pipeline, null, 0);
      this.root = tree;
      
      const totalTime = performance.now() - startTime;
      console.log(`[ELEMENT_TREE] Tree generation finished in ${totalTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('[ELEMENT_TREE] Error during tree generation:', error);
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
    
    // Discover all pads
    const pads = await this.discoverPads(element, elementName);
    
    // Check if this is a bin
    const isGstBin = await element.isOf(GstBin);
    
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
        for await (const obj of iterator) {
          if (!obj) continue;
          const child = await obj.castTo(GstElement);
          
          // Recursive call - pass current node as parent
          const childTree = await this.walkPipelineRecursive(child, treeNode, level + 1);
          treeNode.children.push(childTree);
        }
      }
    }
    
    console.log(`[ELEMENT_TREE] Element ${elementName} processed in ${(performance.now() - elementStart).toFixed(2)}ms`);
    
    return treeNode;
  }

  /**
   * Discover all pads for an element
   */
  private async discoverPads(element: GstElement, elementName: string): Promise<ElementPad[]> {
    const pads: ElementPad[] = [];
    
    const iterator = await element.iterate_pads();
    
    for await (const obj of iterator) {
      if (!obj) continue;
      
      const pad = await obj.castTo(GstPad);
      const padName = (await pad.get_name()) ?? 'unknown';
      const direction = await pad.get_direction();
      const isGhost = await pad.isOf(GstGhostPad);
      
      // Check if pad is linked and get peer
      const isLinked = await pad.is_linked();
      const linkedTo = isLinked ? await pad.get_peer() : null;
      
      // Add the pad
      const representation = `${elementName}-${padName}`;
      pads.push({
        id: pad.ptr,
        representation,
        name: padName,
        pad,
        direction,
        isGhost,
        isInternal: false,
        linkedTo
      });
      
      // If this is a ghost pad, also add the internal pad
      if (isGhost) {
        try {
          const ghostPad = await pad.castTo(GstGhostPad);
          const internal = await ghostPad.get_internal();
          if (internal) {
            const internalName = (await internal.get_name()) ?? 'unknown';
            const internalRepresentation = `${elementName}-${padName}-${internalName}`;
            
            // Check if internal pad is linked
            const internalIsLinked = await internal.is_linked();
            const internalLinkedTo = internalIsLinked ? await internal.get_peer() : null;
            
            pads.push({
              id: internal.ptr,
              representation: internalRepresentation,
              name: internalName,
              pad: internal,
              direction,
              isGhost: false,
              isInternal: true,
              linkedTo: internalLinkedTo
            });
          }
        } catch (err) {
          console.error('Error getting ghost pad internal:', err);
        }
      }
    }
    
    return pads;
  }
}

