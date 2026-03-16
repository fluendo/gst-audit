/**
 * DebugLevelSelector Component
 * 
 * A reusable component for selecting GStreamer debug levels using ToggleButtons.
 * Supports both single-select (exclusive) and multi-select modes.
 * Can use either a primary theme color or per-level custom colors.
 */

'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { GstDebugLevelValue } from '@/lib/gst';

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

export interface DebugLevelSelectorProps {
  /**
   * Current selected level(s).
   * - For single-select (exclusive): a single GstDebugLevelValue
   * - For multi-select: an array of GstDebugLevelValue
   */
  value: GstDebugLevelValue | GstDebugLevelValue[];
  
  /**
   * Callback when selection changes.
   * - For single-select: receives single level or null
   * - For multi-select: receives array of levels
   */
  onChange: (value: GstDebugLevelValue | GstDebugLevelValue[] | null) => void;
  
  /**
   * If true, only one level can be selected at a time (exclusive mode).
   * If false, multiple levels can be selected (multi-select mode).
   * @default false
   */
  exclusive?: boolean;
  
  /**
   * If true, uses per-level colors for selected buttons.
   * If false, uses the primary theme color.
   * @default false
   */
  useColoredButtons?: boolean;
  
  /**
   * Size of the toggle buttons.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Custom height for the button group (in pixels or CSS string).
   */
  height?: string | number;
  
  /**
   * Custom font size for the buttons (in pixels or CSS string).
   */
  fontSize?: string | number;
  
  /**
   * Custom padding for the buttons (CSS string).
   */
  padding?: string;
  
  /**
   * Minimum width for each button (in pixels or CSS string).
   */
  minWidth?: string | number;
  
  /**
   * Additional sx props for the ToggleButtonGroup.
   */
  sx?: object;
  
  /**
   * If true, prevents empty selection in multi-select mode.
   * @default false
   */
  preventEmptySelection?: boolean;
}

export function DebugLevelSelector({
  value,
  onChange,
  exclusive = false,
  useColoredButtons = false,
  size = 'small',
  height,
  fontSize,
  padding,
  minWidth,
  sx = {},
  preventEmptySelection = false,
}: DebugLevelSelectorProps) {
  
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: GstDebugLevelValue | GstDebugLevelValue[] | null) => {
    // Handle multi-select mode
    if (!exclusive) {
      // Prevent empty selection if configured
      if (preventEmptySelection && (!newValue || (Array.isArray(newValue) && newValue.length === 0))) {
        return;
      }
    }
    
    onChange(newValue);
  };
  
  // Prepare value for ToggleButtonGroup
  const buttonGroupValue = exclusive ? value : (Array.isArray(value) ? value : [value]);
  
  return (
    <ToggleButtonGroup
      value={buttonGroupValue}
      onChange={handleChange}
      exclusive={exclusive}
      size={size}
      sx={{
        ...(height && { height }),
        '& .MuiToggleButton-root': {
          ...(fontSize && { fontSize }),
          ...(padding && { padding }),
          lineHeight: 1,
          textTransform: 'capitalize',
          border: '1px solid',
          borderColor: 'divider',
          ...(minWidth && { minWidth }),
          ...(useColoredButtons && {
            // Apply colored backgrounds for selected state
          }),
          '&.Mui-selected': {
            fontWeight: 600,
            ...(useColoredButtons && {
              color: '#ffffff',
            }),
          },
        },
        ...sx,
      }}
    >
      {DEBUG_LEVELS.map((level) => (
        <ToggleButton
          key={level}
          value={level}
          color={!useColoredButtons ? 'primary' : undefined}
          sx={useColoredButtons ? {
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
          } : undefined}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

// Export constants for convenience
export { DEBUG_LEVELS, LEVEL_COLORS };
