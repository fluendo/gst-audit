import { GstElementFactory, GstRegistry } from './gst';

export type StatusCallback = (message: string) => void;

export interface FactoryBasicInfo {
  name: string;
  klass: string;
}

export interface FactoryTreeNode {
  name: string;
  fullPath: string;
  children: Map<string, FactoryTreeNode>;
  factories: FactoryBasicInfo[];
}

export class FactoryTreeManager {
  private root: FactoryTreeNode | null = null;
  private loading: boolean = false;
  private error: string | null = null;
  private statusCallback: StatusCallback | null = null;
  private currentStatus: string = '';

  /**
   * Set a callback to be notified of status updates during factory loading
   */
  setStatusCallback(callback: StatusCallback | null): void {
    this.statusCallback = callback;
  }

  /**
   * Report status update if callback is set
   */
  private reportStatus(message: string): void {
    this.currentStatus = message;
    if (this.statusCallback) {
      this.statusCallback(message);
    }
  }

  /**
   * Get the current status message
   */
  getStatus(): string {
    return this.currentStatus;
  }

  /**
   * Load all factories from the GStreamer registry
   */
  async loadFactories(): Promise<void> {
    if (this.loading) {
      console.log('[FACTORY_TREE] Already loading factories...');
      return;
    }

    if (this.root) {
      console.log('[FACTORY_TREE] Factories already loaded');
      return;
    }

    try {
      this.loading = true;
      this.error = null;

      console.log('[FACTORY_TREE] Starting factory load...');
      this.reportStatus('Loading factories...');
      const startTime = performance.now();

      // Get the GStreamer registry using the bindings
      const registry = await GstRegistry.get();
      
      if (!registry || !registry.ptr) {
        throw new Error('Could not get registry');
      }

      // Get the element factory type for filtering features
      const elementFactoryType = await GstElementFactory.get_type();
      
      // Get all element factory features from the registry
      const featureList = await registry.get_feature_list(elementFactoryType);
      
      if (!featureList) {
        throw new Error('Could not get feature list');
      }

      const factoryInfos: FactoryBasicInfo[] = [];
      let successCount = 0;
      let totalProcessed = 0;

      // Iterate over the GList using the new AsyncIterable interface
      for await (const feature of featureList) {
        totalProcessed++;
        try {
          // Cast the feature to GstElementFactory since we know it's an element factory
          const factory = feature.castTo(GstElementFactory);
          
          const name = await factory.get_name();
          const klass = await factory.get_metadata('klass') || 'Unknown';

          const info: FactoryBasicInfo = {
            name,
            klass,
          };

          factoryInfos.push(info);
          successCount++;
          
          // Report progress every 10 factories or on specific milestones
          if (successCount % 10 === 0 || successCount === 1) {
            this.reportStatus(`Loading factories: ${successCount} loaded (processing ${name}...)`);
          }
        } catch (err) {
          // Skip elements that fail to process
          console.debug('[FACTORY_TREE] Failed to process factory:', err);
        }
      }

      console.log(`[FACTORY_TREE] Processed ${totalProcessed} features, loaded ${successCount} factories`);
      this.reportStatus(`Building factory tree: ${successCount} factories...`);

      // Build tree structure from factory infos
      this.root = this.buildFactoryTree(factoryInfos);
      
      const totalTime = (performance.now() - startTime).toFixed(2);
      const message = `Factories loaded: ${totalTime}ms - ${successCount} factories`;
      console.log(`[FACTORY_TREE] ${message}`);
      this.reportStatus(message);
      
    } catch (err) {
      console.error('[FACTORY_TREE] Error fetching factories:', err);
      this.error = err instanceof Error ? err.message : 'Unknown error';
      this.reportStatus(`Error loading factories: ${this.error}`);
      throw err;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Build a hierarchical tree structure from factory infos
   */
  private buildFactoryTree(factoryInfos: FactoryBasicInfo[]): FactoryTreeNode {
    const root: FactoryTreeNode = {
      name: 'Root',
      fullPath: '',
      children: new Map(),
      factories: []
    };

    for (const factory of factoryInfos) {
      // Split the klass by '/' to get path components
      const pathComponents = factory.klass.split('/').filter(c => c.trim());
      
      let currentNode = root;
      let currentPath = '';

      // Navigate/create the tree structure
      for (let i = 0; i < pathComponents.length; i++) {
        const component = pathComponents[i];
        currentPath = currentPath ? `${currentPath}/${component}` : component;

        if (!currentNode.children.has(component)) {
          currentNode.children.set(component, {
            name: component,
            fullPath: currentPath,
            children: new Map(),
            factories: []
          });
        }

        currentNode = currentNode.children.get(component)!;
      }

      // Add the factory to the leaf node
      currentNode.factories.push(factory);
    }

    // Sort factories at each level
    const sortTree = (node: FactoryTreeNode) => {
      node.factories.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(child => sortTree(child));
    };
    sortTree(root);

    return root;
  }

  /**
   * Get the root of the factory tree
   */
  getRoot(): FactoryTreeNode | null {
    return this.root;
  }

  /**
   * Check if factories are currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Get any error that occurred during loading
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Clear the factory tree
   */
  clear(): void {
    this.root = null;
    this.error = null;
    this.currentStatus = '';
  }

  /**
   * Count total factories in a node (including children)
   */
  countFactories(node: FactoryTreeNode): number {
    let count = node.factories.length;
    node.children.forEach(child => {
      count += this.countFactories(child);
    });
    return count;
  }
}
