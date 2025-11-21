'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getConfig } from '@/lib/config';
import { GstElementFactory, GstRegistry } from '@/lib/gst';

interface FactoryInfo {
  name: string;
  klass: string;
  description: string;
  author: string;
  factory: GstElementFactory;
}

interface TreeNode {
  name: string;
  fullPath: string;
  children: Map<string, TreeNode>;
  factories: FactoryInfo[];
}

export default function FactoriesPage() {
  const [factoryTree, setFactoryTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const config = getConfig();

  const fetchFactories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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

      const factoryInfos: FactoryInfo[] = [];
      let successCount = 0;

      // Iterate over the GList using the new AsyncIterable interface
      for await (const feature of featureList) {
        try {
          // Cast the feature to GstElementFactory since we know it's an element factory
          const factory = feature.castTo(GstElementFactory);
          
          const name = await factory.get_name();
          const klass = await factory.get_metadata('klass') || 'Unknown';
          const description = await factory.get_metadata('description') || '';
          const author = await factory.get_metadata('author') || '';

          const info: FactoryInfo = {
            name,
            klass,
            description,
            author,
            factory
          };

          factoryInfos.push(info);
          successCount++;
        } catch (err) {
          // Skip elements that fail to process
          console.debug('Failed to process factory:', err);
        }
      }

      console.log(`Successfully loaded ${successCount} factories from registry`);

      // Build tree structure from factory infos
      const tree = buildFactoryTree(factoryInfos);
      setFactoryTree(tree);
      
    } catch (err) {
      console.error('Error fetching factories:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactories();
  }, [fetchFactories]);

  const buildFactoryTree = (factoryInfos: FactoryInfo[]): TreeNode => {
    const root: TreeNode = {
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
    const sortTree = (node: TreeNode) => {
      node.factories.sort((a, b) => a.name.localeCompare(b.name));
      node.children.forEach(child => sortTree(child));
    };
    sortTree(root);

    return root;
  };

  const toggleNode = (fullPath: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(fullPath)) {
      newExpanded.delete(fullPath);
    } else {
      newExpanded.add(fullPath);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleAllNodes = () => {
    if (!factoryTree) return;

    const allPaths = new Set<string>();
    const collectPaths = (node: TreeNode) => {
      if (node.fullPath) {
        allPaths.add(node.fullPath);
      }
      node.children.forEach(child => collectPaths(child));
    };
    collectPaths(factoryTree);

    if (expandedNodes.size === allPaths.size) {
      // All expanded, collapse all
      setExpandedNodes(new Set());
    } else {
      // Expand all
      setExpandedNodes(allPaths);
    }
  };

  const countFactories = (node: TreeNode): number => {
    let count = node.factories.length;
    node.children.forEach(child => {
      count += countFactories(child);
    });
    return count;
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    
    node.children.forEach((childNode) => {
      const isExpanded = expandedNodes.has(childNode.fullPath);
      const hasChildren = childNode.children.size > 0;
      const hasFactories = childNode.factories.length > 0;
      const totalFactories = countFactories(childNode);
      
      elements.push(
        <div key={childNode.fullPath}>
          {/* Category/Node Header */}
          <button
            onClick={() => toggleNode(childNode.fullPath)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors border-b border-gray-200 dark:border-gray-700"
            style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
          >
            <span className="text-base">
              {isExpanded ? '▼' : '▶'}
            </span>
            <h3 className="text-lg font-semibold">{childNode.name}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({totalFactories} {totalFactories === 1 ? 'element' : 'elements'})
            </span>
          </button>
          
          {isExpanded && (
            <div className="bg-white dark:bg-gray-900">
              {/* Render child nodes first */}
              {hasChildren && (
                <div>
                  {renderTreeNode(childNode, depth + 1)}
                </div>
              )}
              
              {/* Render factories at this level */}
              {hasFactories && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {childNode.factories.map(factory => (
                    <div
                      key={factory.name}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      style={{ paddingLeft: `${(depth + 1) * 1.5 + 1}rem` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {factory.name}
                          </h4>
                          {factory.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {factory.description}
                            </p>
                          )}
                          {factory.author && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Author: {factory.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Path: {factory.klass}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
    
    return elements;
  };

  const totalFactories = factoryTree ? countFactories(factoryTree) : 0;

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">GStreamer Element Factories</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              API: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{config.gstauditBaseUrl}</code>
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Back to Home
          </Link>
        </div>
        
        {!loading && !error && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {totalFactories} factories
            </p>
            <button
              onClick={toggleAllNodes}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {expandedNodes.size > 0 ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        )}
      </header>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading factories...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <h2 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchFactories}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && factoryTree && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {renderTreeNode(factoryTree)}
        </div>
      )}

      {!loading && !error && !factoryTree && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p>No factories found. Make sure the GStreamer REST API is running.</p>
        </div>
      )}
    </div>
  );
}
