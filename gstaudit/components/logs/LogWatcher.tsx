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
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

export function LogWatcher() {
  const [showCategories, setShowCategories] = useState(false);
  const logViewerRef = useRef<LogViewerHandle>(null);
  const categoriesPanelRef = useRef<ImperativePanelHandle>(null);

  const handleClear = () => {
    logViewerRef.current?.clearLogs();
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
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
      {/* Header with icons */}
      <div className="flex justify-end items-center gap-0.5 px-1 py-0.5 border-b border-gray-200 dark:border-gray-800">
        <IconButton
          onClick={handleClear}
          size="small"
          title="Clear logs"
          sx={{ padding: '4px' }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
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
          <Panel defaultSize={70} minSize={40}>
            <LogViewer ref={logViewerRef} />
          </Panel>
          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors" />
          <Panel 
            ref={categoriesPanelRef}
            defaultSize={30} 
            minSize={20} 
            maxSize={60}
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
