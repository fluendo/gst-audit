'use client';

import { useState, useEffect } from 'react';
import { GstElementFactory, GstRegistry } from '@/lib/gst';

interface FactoryDetailProps {
  selectedFactory: string | null;
}

export function FactoryDetail({ selectedFactory }: FactoryDetailProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [factoryDetails, setFactoryDetails] = useState<{
    name: string;
    klass: string;
    description: string;
    author: string;
    longname: string;
  } | null>(null);

  useEffect(() => {
    if (!selectedFactory) {
      setFactoryDetails(null);
      return;
    }

    const fetchFactoryDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the GStreamer registry
        const registry = await GstRegistry.get();
        
        if (!registry || !registry.ptr) {
          throw new Error('Could not get registry');
        }

        // Find the factory by name
        const feature = await registry.find_feature(selectedFactory, await GstElementFactory.get_type());
        
        if (!feature) {
          throw new Error(`Factory '${selectedFactory}' not found`);
        }

        // Cast to GstElementFactory
        const factory = feature.castTo(GstElementFactory);

        // Fetch all the details
        const name = await factory.get_name() || '';
        const klass = await factory.get_metadata('klass') || 'Unknown';
        const description = await factory.get_metadata('description') || '';
        const author = await factory.get_metadata('author') || '';
        const longname = await factory.get_metadata('long-name') || '';

        setFactoryDetails({
          name,
          klass,
          description,
          author,
          longname,
        });
      } catch (err) {
        console.error('Error fetching factory details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFactoryDetails();
  }, [selectedFactory]);

  if (!selectedFactory) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a factory to view details
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 max-w-md">
          <h2 className="text-red-800 dark:text-red-200 font-semibold text-sm mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-300 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (!factoryDetails) {
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-900 p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mb-2">
            {factoryDetails.name}
          </h2>
          {factoryDetails.longname && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {factoryDetails.longname}
            </p>
          )}
        </div>

        {factoryDetails.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {factoryDetails.description}
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Classification
          </h3>
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {factoryDetails.klass}
          </p>
        </div>

        {factoryDetails.author && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Author
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {factoryDetails.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
