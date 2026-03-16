/**
 * LogCategorySelector Component
 * 
 * Displays and manages GStreamer debug log categories.
 * Allows setting log levels per category.
 * 
 * Communication:
 * - REST API: Fetch categories from server
 * - WebSocket: Send level changes to server
 * - WebSocket: Receive current category states from server (TODO)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gst, GstDebugCategory, type GstDebugLevelValue } from '@/lib/gst';
import { useSession } from '@/lib/SessionContext';
import { useLogRegistry } from '@/hooks/useLogRegistry';
import { Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';

const DEBUG_LEVELS: GstDebugLevelValue[] = [
  "none", "error", "warning", "fixme", "info", "debug", "log", "trace", "memdump"
];

export interface CategoryData {
  ptr: string;
  name: string;
  description: string;
  level: GstDebugLevelValue;
}

interface LogCategorySelectorProps {
  onCategoryLevelChange?: (categoryPtr: string, level: GstDebugLevelValue) => void;
}

export function LogCategorySelector({ 
  onCategoryLevelChange 
}: LogCategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Get session from context
  const { sessionId, callbackSecret, connection } = useSession();

  // Get setCategoryLevel from log registry
  const { setCategoryLevel: sendCategoryLevel } = useLogRegistry({
    sessionId,
    callbackSecret,
    onLog: () => {}, // We don't need logs here, just the setCategoryLevel function
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setStatus('Fetching debug categories...');
      
      // Fetch the linked list of categories (GLibSList)
      let list = await Gst.debug_get_all_categories();
      const fetchedCategories: CategoryData[] = [];
      
      // Traverse the list
      while (list && list.ptr && list.ptr !== '0x0') {
        try {
          const dataPtr = await list.get_data();
          if (dataPtr && dataPtr !== '0x0') {
            // Instantiate the category from the pointer
            const cat = await GstDebugCategory.create(dataPtr, 'none');
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

  // Fetch categories only on first mount
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLevelChange = async (ptr: string, newLevel: GstDebugLevelValue) => {
    // Update UI optimistically
    setCategories(prev => prev.map(c =>
      c.ptr === ptr ? { ...c, level: newLevel } : c
    ));

    // Send to server via WebSocket
    sendCategoryLevel(ptr, newLevel);
    
    // Notify parent (for any additional logic)
    onCategoryLevelChange?.(ptr, newLevel);
  };

  const handleSelectChange = (ptr: string) => (event: SelectChangeEvent) => {
    handleLevelChange(ptr, event.target.value as GstDebugLevelValue);
  };

  return (
    <section className="flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="px-2 py-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xs font-medium">Categories ({categories.length})</h3>
            {status && <p className="text-[10px] text-gray-500">{status}</p>}
          </div>
          <Button
            onClick={fetchCategories}
            disabled={loading}
            variant="contained"
            size="small"
            sx={{ 
              textTransform: 'none', 
              fontSize: '10px',
              minWidth: 'auto',
              padding: '2px 8px',
              lineHeight: 1.2
            }}
          >
            {loading ? 'Loading' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Categories list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {categories.length === 0 && !loading && (
          <div className="text-center p-8 text-gray-500">
            No categories found. Click Refresh.
          </div>
        )}
        {categories.map((cat) => (
          <div 
            key={cat.ptr} 
            className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
          >
            <div className="overflow-hidden mr-4 flex-1">
              <div className="font-mono text-sm truncate" title={cat.name}>
                {cat.name}
              </div>
              <div className="text-xs text-gray-500 truncate" title={cat.description}>
                {cat.description}
              </div>
            </div>
            <Select
              value={cat.level}
              onChange={handleSelectChange(cat.ptr)}
              size="small"
              sx={{ 
                minWidth: 100,
                fontSize: '0.875rem', // 14px - standard small size
                '& .MuiSelect-select': {
                  paddingTop: '6px',
                  paddingBottom: '6px',
                }
              }}
            >
              {DEBUG_LEVELS.map(lvl => (
                <MenuItem 
                  key={lvl} 
                  value={lvl}
                >
                  {lvl.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </div>
        ))}
      </div>
    </section>
  );
}
