/**
 * LogWatcher Component
 * 
 * Wrapper component that contains LogViewer and LogCategorySelector.
 * Provides a header with controls for clearing logs and showing categories.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { LogViewer, type LogViewerHandle } from './LogViewer';
import { LogCategorySelector } from './LogCategorySelector';
import { DebugLevelSelector } from './DebugLevelSelector';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { IconButton, TextField, ToggleButton, Chip, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import type { GstDebugLevelValue } from '@/lib/gst';

const DEBUG_LEVELS: GstDebugLevelValue[] = [
  "none", "error", "warning", "fixme", "info", "debug", "log", "trace", "memdump"
];

interface LogWatcherProps {
  selectedElementName?: string | null;
  onElementSelect?: (elementName: string | null) => void;
}

export function LogWatcher({ selectedElementName, onElementSelect }: LogWatcherProps = {}) {
  const [showCategories, setShowCategories] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [objectFilter, setObjectFilter] = useState<string | null>(null);
  const [enabledLevels, setEnabledLevels] = useState<Set<GstDebugLevelValue>>(
    new Set(DEBUG_LEVELS)
  );
  const logViewerRef = useRef<LogViewerHandle>(null);
  const categoriesPanelRef = useRef<ImperativePanelHandle>(null);

  // Sync objectFilter with selectedElementName from parent
  useEffect(() => {
    if (selectedElementName !== undefined) {
      setObjectFilter(selectedElementName);
    }
  }, [selectedElementName]);

  const handleClear = () => {
    logViewerRef.current?.clearLogs();
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleObjectFilterRemove = () => {
    setObjectFilter(null);
    // Also notify parent to clear selection
    onElementSelect?.(null);
  };

  const handleObjectClick = (objectName: string) => {
    setObjectFilter(objectName);
    onElementSelect?.(objectName);
  };

  const toggleAllLevels = () => {
    if (enabledLevels.size === DEBUG_LEVELS.length) {
      setEnabledLevels(new Set());
    } else {
      setEnabledLevels(new Set(DEBUG_LEVELS));
    }
  };

  // Collapse/expand the panel when showCategories changes
  useEffect(() => {
    if (categoriesPanelRef.current) {
      if (showCategories) {
        categoriesPanelRef.current.expand();
      } else {
        categoriesPanelRef.current.collapse();
      }
    }
  }, [showCategories]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with filter controls */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-200 dark:border-gray-800">
        {/* Clear button */}
        <IconButton
          onClick={handleClear}
          size="small"
          title="Clear logs"
          sx={{ padding: '4px' }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Text filter */}
        <TextField
          placeholder="Filter logs..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              height: '28px',
              fontSize: '11px',
            },
            '& .MuiInputBase-input': {
              padding: '4px 8px',
            }
          }}
          InputProps={{
            startAdornment: objectFilter ? (
              <InputAdornment position="start">
                <Chip
                  label={`Object: ${objectFilter}`}
                  size="small"
                  onDelete={handleObjectFilterRemove}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    height: '22px',
                    fontSize: '10px',
                    '& .MuiChip-deleteIcon': {
                      fontSize: '14px',
                    }
                  }}
                />
              </InputAdornment>
            ) : undefined,
          }}
        />


        {/* Level filter toggle buttons */}
        <DebugLevelSelector
          value={Array.from(enabledLevels)}
          onChange={(newLevels) => {
            if (Array.isArray(newLevels) && newLevels.length > 0) {
              setEnabledLevels(new Set(newLevels));
            }
          }}
          exclusive={false}
          useColoredButtons={false}
          height="28px"
          fontSize="10px"
          padding="4px 8px"
          minWidth="60px"
          preventEmptySelection={true}
        />

        {/* ALL toggle button */}
        <ToggleButton
          value="all"
          selected={enabledLevels.size === DEBUG_LEVELS.length}
          onChange={toggleAllLevels}
          color="primary"
          size="small"
          sx={{
            fontSize: '10px',
            padding: '4px 8px',
            lineHeight: 1,
            textTransform: 'none',
            border: '1px solid',
            borderColor: 'divider',
            height: '28px',
            minWidth: '60px',
            '&.Mui-selected': {
              fontWeight: 600,
            },
          }}
        >
          ALL
        </ToggleButton>

        {/* Categories toggle button */}
        <IconButton
          onClick={toggleCategories}
          size="small"
          title="Log categories"
          color={showCategories ? 'primary' : 'default'}
          sx={{ padding: '4px' }}
        >
          <SettingsIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </div>

      {/* Content area with LogViewer and optional LogCategorySelector */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={75} minSize={40}>
            <LogViewer 
              ref={logViewerRef} 
              filterText={filterText}
              objectFilter={objectFilter}
              enabledLevels={enabledLevels}
              onObjectClick={handleObjectClick}
            />
          </Panel>
          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
          <Panel 
            ref={categoriesPanelRef}
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            collapsible={true}
            collapsedSize={0}
          >
            <LogCategorySelector />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
