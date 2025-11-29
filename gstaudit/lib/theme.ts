/**
 * Theme configuration for pipeline visualization
 * Contains dimensional values needed for TypeScript calculations
 * Visual styles are in CSS files
 */

export interface PipelineTheme {
  name: string;
  
  // Node dimensions
  node: {
    elementWidth: number;
    elementMinHeight: number;
    headerHeight: number;
    groupMinWidth: number;
    groupMinHeight: number;
  };
  
  // Pad dimensions
  pad: {
    width: number; // Fixed width of pad handle
    height: number; // Fixed height of pad handle
    padding: number; // Horizontal padding inside pad handle
    spacing: number; // Space between pads vertically
    offsetFromBorder: number; // Distance from element border
    ghostContainerHeight: number;
    ghostContainerPadding: number;
  };
  
  // Layout settings
  layout: {
    groupPaddingTop: number;
    groupPaddingLeft: number;
    groupPaddingBottom: number;
    groupPaddingRight: number;
    nodeSpacing: number;
    layerSpacing: number;
  };
}

/**
 * Classic GStreamer dot graph theme
 */
export const gstDotTheme: PipelineTheme = {
  name: 'gst-dot',
  
  node: {
    elementWidth: 140,
    elementMinHeight: 60,
    headerHeight: 36,
    groupMinWidth: 200,
    groupMinHeight: 120,
  },
  
  pad: {
    width: 58,
    height: 20,
    padding: 6,
    spacing: 50, // Total space per pad (including pad + gap)
    offsetFromBorder: 8,
    ghostContainerHeight: 54,
    ghostContainerPadding: 4,
  },
  
  layout: {
    groupPaddingTop: 100,
    groupPaddingLeft: 150,
    groupPaddingBottom: 50,
    groupPaddingRight: 150,
    nodeSpacing: 50,
    layerSpacing: 70,
  },
};

// Active theme - can be switched at runtime
let currentTheme: PipelineTheme = gstDotTheme;

export const getTheme = (): PipelineTheme => currentTheme;

export const setTheme = (theme: PipelineTheme): void => {
  currentTheme = theme;
  
  // Update CSS variables to match theme dimensions
  updateCSSVariables(theme);
};

/**
 * Synchronize CSS custom properties with theme values
 * This allows CSS to use the same dimensional values
 */
const updateCSSVariables = (theme: PipelineTheme): void => {
  const root = document.documentElement;
  
  // Node dimensions
  root.style.setProperty('--node-element-width', `${theme.node.elementWidth}px`);
  root.style.setProperty('--node-header-height', `${theme.node.headerHeight}px`);
  root.style.setProperty('--node-group-min-width', `${theme.node.groupMinWidth}px`);
  root.style.setProperty('--node-group-min-height', `${theme.node.groupMinHeight}px`);
  
  // Pad dimensions
  root.style.setProperty('--pad-width', `${theme.pad.width}px`);
  root.style.setProperty('--pad-height', `${theme.pad.height}px`);
  root.style.setProperty('--pad-padding', `${theme.pad.padding}px`);
  root.style.setProperty('--pad-offset', `${theme.pad.offsetFromBorder}px`);
  root.style.setProperty('--pad-ghost-height', `${theme.pad.ghostContainerHeight}px`);
  root.style.setProperty('--pad-ghost-padding', `${theme.pad.ghostContainerPadding}px`);
};

// Initialize CSS variables on load
if (typeof window !== 'undefined') {
  updateCSSVariables(currentTheme);
}
