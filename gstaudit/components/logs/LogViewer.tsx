/**
 * LogViewer Component
 * 
 * Displays live logs from a GStreamer connection.
 * Connects via WebSocket and receives logs in real-time.
 */

'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useLogRegistry, type LogEntry } from '@/hooks/useLogRegistry';
import { useSession } from '@/lib/SessionContext';

interface LogViewerProps {
  onStartLogging?: () => void;
  onStopLogging?: () => void;
}

export interface LogViewerHandle {
  clearLogs: () => void;
}

export const LogViewer = forwardRef<LogViewerHandle, LogViewerProps>(({ 
  onStartLogging,
  onStopLogging 
}, ref) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // Get session from context
  const { sessionId, callbackSecret, connection } = useSession();

  // Handle incoming logs - data is already fully formatted!
  const handleLog = (log: LogEntry) => {
    setLogs(prev => {
      const updated = [...prev, log];
      // Keep last 500 logs
      return updated.slice(-500);
    });
  };

  // Connect to log stream
  const { isConnected } = useLogRegistry({
    sessionId,
    callbackSecret,
    onLog: handleLog,
  });

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isLogging && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLogging]);

  const handleToggleLogging = () => {
    if (isLogging) {
      setIsLogging(false);
      onStopLogging?.();
    } else {
      setIsLogging(true);
      onStartLogging?.();
    }
  };

  const handleClear = () => {
    setLogs([]);
  };

  // Expose clearLogs method to parent via ref
  useImperativeHandle(ref, () => ({
    clearLogs: handleClear
  }));

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black text-gray-200">
      {/* Log output */}
      <div className="flex-1 p-2 font-mono text-xs leading-tight overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-gray-700">
        {logs.length > 0 ? (
          <div>
            {logs.map((log, idx) => (
              <div key={idx} className="hover:bg-gray-900">
                <span className={`${
                  log.level === 'error' ? 'text-red-500' :
                  log.level === 'warning' ? 'text-yellow-500' :
                  log.level === 'fixme' ? 'text-orange-500' :
                  log.level === 'info' ? 'text-blue-400' :
                  log.level === 'debug' ? 'text-green-400' :
                  log.level === 'log' ? 'text-purple-400' :
                  log.level === 'trace' ? 'text-pink-400' :
                  log.level === 'memdump' ? 'text-teal-400' :
                  'text-gray-500'
                }`}>
                  {log.level.toUpperCase().padEnd(8)}
                </span>
                <span className="text-cyan-400">{log.category.padEnd(20)} </span>
                <span className="text-gray-400">{log.file}:{log.line}:{log.function}</span>
                {log.object && <span className="text-purple-400"> &lt;{log.object}&gt;</span>}
                <span className="text-gray-300"> {log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <p>No logs captured.</p>
          </div>
        )}
      </div>
    </div>
  );
});

LogViewer.displayName = 'LogViewer';
