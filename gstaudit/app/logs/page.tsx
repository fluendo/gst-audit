'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getConfig } from '@/lib/config';
import { 
  setApiConfig, 
  Gst, 
  GstDebugCategory, 
  GLibSList,
  type GstDebugLevelValue 
} from '@/lib/gst';

const DEBUG_LEVELS: GstDebugLevelValue[] = [
  "none", "error", "warning", "fixme", "info", "debug", "log", "trace", "memdump"
];

interface CategoryData {
  ptr: string;
  name: string;
  description: string;
  level: GstDebugLevelValue;
}

export default function LogsPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>('');
  const [isLogging, setIsLogging] = useState(false);
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    const conf = getConfig();
    setApiConfig({ 
      host: conf.host, 
      port: conf.port, 
      basePath: conf.basePath 
    });
  }, []);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setStatus('Fetching debug categories...');
            // Fetch the linked list of categories (GLibSList)
            let list = await Gst.debug_get_all_categories();

            const fetchedCategories: CategoryData[] = [];
            // Traverse the list (this can be slow if there are many categories, optimizable on the backend)
            // Note: In a real implementation, it would be ideal to have an endpoint that returns the entire JSON array
            while (list && list.ptr && list.ptr !== '0x0') {
                try {
                    const dataPtr = await list.get_data();
                    if (dataPtr && dataPtr !== '0x0') {
                        // Instantiate the category from the pointer
                        const cat = new GstDebugCategory(dataPtr, 'none');
                        // Fetch details in parallel
                        const [name, desc, level] = await Promise.all([
                            cat.get_name(),
                            cat.get_description(),
                            cat.get_threshold()
                        ]);
                        fetchedCategories.push({
                            ptr: dataPtr,
                            name,
                            description: desc,
                            level
                        });
                    }
                    const next = await list.get_next();
                    // Break if there is no valid next node
                    if (!next || !next.ptr || next.ptr === '0x0') break;
                    list = next;
                } catch (e) {
                    console.warn("Error fetching category node", e);
                    break;
                }
            }
            fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
            setCategories(fetchedCategories);
            setStatus(`Loaded ${fetchedCategories.length} categories`);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setStatus('Error loading categories');
        } finally {
            setLoading(false);
        }
    }, []);

  const handleLevelChange = async (ptr: string, newLevel: GstDebugLevelValue) => {
    try {
      // Re-instantiate the category by pointer to change its level
      const cat = new GstDebugCategory(ptr, 'none');
      await cat.set_threshold(newLevel);
      
      setCategories(prev => prev.map(c => 
        c.ptr === ptr ? { ...c, level: newLevel } : c
      ));
    } catch (error) {
      console.error(`Error setting threshold for ${ptr}:`, error);
      alert('Failed to update debug level');
    }
  };

  const toggleLogging = async () => {
    if (isLogging) {
      setIsLogging(false);
      setStatus('Logging stopped (polling paused)');
    } else {
      try {
        // Start logger: 10KB per thread, 1s timeout
        await Gst.debug_add_ring_buffer_logger(1024 * 10, 1000);
        setIsLogging(true);
        setStatus('Logging active...');
      } catch (error) {
        console.error('Error starting logger:', error);
        alert('Failed to start ring buffer logger');
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLogging) {
      interval = setInterval(async () => {
        try {
          // Attempt to fetch logs
          // If the API returns a pointer (e.g., "0x55..."), girest is not decoding the char* automatically.
          const rawResult = await Gst.debug_ring_buffer_logger_get_logs();
          
          if (rawResult && rawResult.length > 0) {
             // Basic detection if it's a hexadecimal pointer
             if (rawResult.startsWith('0x')) {
                 setLogs(prev => prev + `\n[System returned raw pointer: ${rawResult} - unable to decode text remotely]\n`);
             } else {
                 setLogs(prev => prev + rawResult);
             }
          }
        } catch (e) {
          console.error("Error fetching logs:", e);
        }
      }, 2000); // Polling cada 2s
    }
    return () => clearInterval(interval);
  }, [isLogging]);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GStreamer Debug Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure levels and view output</p>
        </div>
        <div className="space-x-4">
            <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700">
              Back to Home
            </Link>
            <button 
              onClick={fetchCategories} 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Categories'}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
        {/* Left panel: List of categories */}
        <section className="border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">{status}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {categories.length === 0 && !loading && (
               <div className="text-center p-8 text-gray-500">
                 No categories found. Click Refresh.
               </div>
            )}
            {categories.map((cat) => (
              <div key={cat.ptr} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="overflow-hidden mr-4">
                  <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 truncate" title={cat.name}>
                    {cat.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate" title={cat.description}>
                    {cat.description}
                  </div>
                </div>
                <select
                  value={cat.level}
                  onChange={(e) => handleLevelChange(cat.ptr, e.target.value as GstDebugLevelValue)}
                  className={`
                    p-1 text-xs rounded border cursor-pointer font-medium w-24
                    ${cat.level === 'none' ? 'text-gray-400 border-gray-200' : ''}
                    ${cat.level === 'error' || cat.level === 'warning' ? 'text-red-600 border-red-200 bg-red-50' : ''}
                    ${cat.level === 'info' || cat.level === 'debug' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                    ${cat.level === 'log' || cat.level === 'trace' ? 'text-purple-600 border-purple-200 bg-purple-50' : ''}
                  `}
                >
                  {DEBUG_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* Right panel: Live logs */}
        <section className="border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col overflow-hidden bg-black text-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Live Output</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setLogs('')}
                className="px-3 py-1 text-xs uppercase font-bold tracking-wide border border-gray-700 rounded hover:bg-gray-800 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={toggleLogging}
                className={`px-3 py-1 text-xs uppercase font-bold tracking-wide rounded text-white transition-colors ${
                  isLogging ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLogging ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-gray-700">
            {logs ? (
              <pre className="whitespace-pre-wrap break-all">{logs}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                <p>No logs captured.</p>
                <p className="text-xs mt-2">Click "Start" to begin polling.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}