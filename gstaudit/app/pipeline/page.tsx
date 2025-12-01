'use client';

import { useState, useRef } from 'react';
import '@xyflow/react/dist/style.css';
import '../pipeline-theme.css';
import Link from 'next/link';
import { getConfig, ElementTreeManager } from '@/lib';
import {
  GstPipeline,
  GstBin,
  GstElement,
  GstState,
  GstStateValue
} from '@/lib/gst';
import { PipelineGraph } from '@/components';

const detectSubpipelines = async (pipeline: GstPipeline | GstBin, parentName = ''): Promise<{ name: string; ptr: string }[]> => {
  const subpipelines: { name: string; ptr: string }[] = [];
  const iterator = await pipeline.iterate_elements();
  if (!iterator) return subpipelines;

  for await (const obj of iterator) {
    if (!obj) continue;
    const element = await obj.castTo(GstElement);

    if (await element.isOf(GstBin)) {
      const bin = await element.castTo(GstBin);
      const subpipelineName = await bin.get_name();
      const fullName = parentName ? `${parentName} > ${subpipelineName ?? 'unknown'}` : (subpipelineName ?? 'unknown');

      subpipelines.push({ name: fullName, ptr: bin.ptr });

      const nestedSubpipelines = await detectSubpipelines(bin, fullName);
      subpipelines.push(...nestedSubpipelines);
    }
  }

  return subpipelines;
};

export default function PipelinePage() {
  const [status, setStatus] = useState<string>('Disconnected');
  const [pipelines, setPipelines] = useState<{ name: string; ptr: string }[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [pipelineLoaded, setPipelineLoaded] = useState(false);
  
  const elementTreeManager = useRef(new ElementTreeManager()).current;
  
  const config = getConfig();

  const fetchPipelines = async () => {
    try {
      setStatus('Fetching pipelines...');
      const response = await fetch(`${config.gstauditBaseUrl}/GstAudit/pipelines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pipelinesData = await response.json();

      const allPipelines: { name: string; ptr: string }[] = [];

      for (const pipeline of pipelinesData) {
        const gstPipeline = new GstPipeline(pipeline.ptr, 'none');
        const pipelineName = pipeline.name;

        allPipelines.push({ name: pipelineName, ptr: gstPipeline.ptr });

        const subpipelines = await detectSubpipelines(gstPipeline, pipelineName);
        allPipelines.push(...subpipelines);
      }

      setPipelines(allPipelines);
      setStatus(`Found ${allPipelines.length} pipeline(s)`);
      console.log('Pipelines:', allPipelines);
      if (allPipelines.length > 0) {
        setSelectedPipeline(allPipelines[0].ptr);
      } else {
        setStatus('No pipelines found');
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const loadPipeline = async () => {
    if (!selectedPipeline) {
      alert('No pipeline selected!');
      return;
    }

    try {
      setStatus('Loading pipeline...');
      setPipelineLoaded(false);
      elementTreeManager.clear();
      
      console.log('========================================');
      console.log('[LOAD] Starting pipeline load');
      console.log('========================================');
      
      const loadStart = performance.now();
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      
      await elementTreeManager.generateTree(pipeline);
      
      const loadEnd = performance.now();
      const totalTime = (loadEnd - loadStart).toFixed(2);
      
      const tree = elementTreeManager.getRoot();
      if (tree) {
        const flatTree = elementTreeManager.getFlatTree();
        const elementCount = flatTree.length;
        const padCount = flatTree.reduce((sum, node) => sum + node.pads.length, 0);
        
        console.log('========================================');
        console.log(`[LOAD] Pipeline loaded successfully:`);
        console.log(`[LOAD] - Total time: ${totalTime}ms`);
        console.log(`[LOAD] - Elements: ${elementCount}`);
        console.log(`[LOAD] - Pads: ${padCount}`);
        console.log('========================================');
        
        setStatus(`Pipeline loaded: ${totalTime}ms - ${elementCount} elements, ${padCount} pads`);
        setPipelineLoaded(true);
      } else {
        setStatus('Error: No tree generated');
      }
    } catch (error) {
      console.error('Error loading pipeline:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const setPipelineState = async (state: GstStateValue) => {
    if (!selectedPipeline) {
      alert('No pipeline selected!');
      return;
    }

    try {
      const stateName = state === GstState.PLAYING ? 'PLAYING' : 'PAUSED';
      setStatus(`Setting state to ${stateName}...`);
      const pipeline = new GstPipeline(selectedPipeline, 'none');
      await pipeline.set_state(state);
      setStatus(`State set to ${stateName}`);
    } catch (error) {
      console.error('Error setting pipeline state:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pipeline Visualization</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{config.gstauditBaseUrl}</code>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchPipelines}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fetch Pipelines
            </button>
            {pipelines.length > 0 && (
              <select
                value={selectedPipeline || ''}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {pipelines.map((pipeline) => (
                  <option key={pipeline.ptr} value={pipeline.ptr}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            )}
            {selectedPipeline && (
              <>
                <button
                  onClick={loadPipeline}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Load Pipeline
                </button>
                <button
                  onClick={() => setPipelineState(GstState.PLAYING)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Play
                </button>
                <button
                  onClick={() => setPipelineState(GstState.PAUSED)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Pause
                </button>
              </>
            )}
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <p className="mt-2 text-sm">Status: <span className="font-mono">{status}</span></p>
      </header>

      <div className="flex-1">
        {pipelineLoaded ? (
          <PipelineGraph treeManager={elementTreeManager} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {selectedPipeline 
              ? 'Click "Load Pipeline" to visualize the pipeline' 
              : 'Select a pipeline and click "Load Pipeline"'}
          </div>
        )}
      </div>
    </div>
  );
}
