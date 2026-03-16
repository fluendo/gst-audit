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

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Gst, GstDebugCategory, type GstDebugLevelValue } from '@/lib/gst';
import { IconButton, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const DEBUG_LEVELS: GstDebugLevelValue[] = [
  "none", "error", "warning", "fixme", "info", "debug", "log", "trace", "memdump"
];

// Color mapping for debug levels
const LEVEL_COLORS: Record<GstDebugLevelValue, string> = {
  none: '#94a3b8',      // slate-400
  error: '#ef4444',     // red-500
  warning: '#f97316',   // orange-500
  fixme: '#eab308',     // yellow-500
  info: '#3b82f6',      // blue-500
  debug: '#22c55e',     // green-500
  log: '#06b6d4',       // cyan-500
  trace: '#a855f7',     // purple-500
  memdump: '#ec4899',   // pink-500
  count: '#94a3b8',     // slate-400 (fallback, shouldn't be used)
};

// Get level index for comparison
const getLevelIndex = (level: GstDebugLevelValue): number => {
  return DEBUG_LEVELS.indexOf(level);
};

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
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [filterText, setFilterText] = useState('');
  
  // Computed filtered categories
  const filteredCategories = useMemo(() => {
    let result = categories;
    
    // Filter by active status (level !== 'none')
    if (showActiveOnly) {
      result = result.filter(cat => cat.level !== 'none');
    }
    
    // Filter by text (name or description)
    if (filterText) {
      const search = filterText.toLowerCase();
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(search) || 
        cat.description.toLowerCase().includes(search)
      );
    }
    
    return result;
  }, [categories, showActiveOnly, filterText]);
  
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
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
    } catch (error) {
      console.error('Error fetching categories:', error);
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

    try {
      // Call REST API directly to set the category level
      const category = await GstDebugCategory.create(ptr, 'none');
      await category.set_threshold(newLevel);
      
      console.log(`[LogCategorySelector] Set category ${ptr} to level ${newLevel}`);
      
      // Notify parent (for any additional logic)
      onCategoryLevelChange?.(ptr, newLevel);
    } catch (error) {
      console.error(`[LogCategorySelector] Failed to set category level:`, error);
      // Revert optimistic update on error
      setCategories(prev => prev.map(c =>
        c.ptr === ptr ? { ...c, level: categories.find(cat => cat.ptr === ptr)?.level || newLevel } : c
      ));
    }
  };

  return (
    <section className="flex flex-col overflow-hidden h-full">
      {/* Categories list */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {filteredCategories.length === 0 && !loading && (
          <div className="text-center p-8 text-gray-500 text-xs">
            {categories.length === 0 
              ? 'No categories found. Click Refresh.'
              : 'No categories match the current filter.'
            }
          </div>
        )}
        {filteredCategories.map((cat) => (
          <div 
            key={cat.ptr} 
            className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
          >
            {/* Category name and description */}
            <div className="mb-1">
              <div className="font-mono text-xs font-medium truncate" title={cat.name}>
                {cat.name}
              </div>
              {cat.description && (
                <div className="text-[10px] text-gray-500 truncate" title={cat.description}>
                  {cat.description}
                </div>
              )}
            </div>
            
            {/* Level toggle buttons */}
            <ToggleButtonGroup
              value={cat.level}
              exclusive
              onChange={(_, newLevel) => {
                if (newLevel !== null) {
                  handleLevelChange(cat.ptr, newLevel as GstDebugLevelValue);
                }
              }}
              size="small"
              sx={{
                height: '24px',
                '& .MuiToggleButton-root': {
                  fontSize: '9px',
                  padding: '2px 6px',
                  lineHeight: 1,
                  textTransform: 'capitalize',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: '48px',
                }
              }}
            >
              {DEBUG_LEVELS.map((level) => (
                <ToggleButton
                  key={level}
                  value={level}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: LEVEL_COLORS[level],
                      borderColor: LEVEL_COLORS[level],
                      color: '#ffffff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: LEVEL_COLORS[level],
                        filter: 'brightness(0.9)',
                      }
                    }
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        ))}
      </div>

      {/* Status bar with filters */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-2 py-1.5 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          {/* Toggle: All / Active Only */}
          <ToggleButtonGroup
            value={showActiveOnly ? 'active' : 'all'}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setShowActiveOnly(value === 'active');
              }
            }}
            size="small"
            sx={{
              height: '22px',
              '& .MuiToggleButton-root': {
                fontSize: '9px',
                padding: '2px 8px',
                lineHeight: 1,
                textTransform: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="active">Active</ToggleButton>
          </ToggleButtonGroup>

          {/* Text filter */}
          <TextField
            placeholder="Filter..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                height: '22px',
                fontSize: '10px',
              },
              '& .MuiInputBase-input': {
                padding: '2px 6px',
              }
            }}
          />

          {/* Count indicator and refresh button */}
          <span className="text-[9px] text-gray-500 whitespace-nowrap">
            {filteredCategories.length} / {categories.length}
          </span>
          <IconButton
            onClick={fetchCategories}
            disabled={loading}
            size="small"
            sx={{ 
              padding: '2px',
              '&:disabled': {
                opacity: 0.5
              }
            }}
          >
            <RefreshIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </div>
      </div>
    </section>
  );
}
