/**
 * Shared constants used across the application.
 * This file centralizes magic numbers and hardcoded values for easier maintenance.
 */

// Brand colors - should match tailwind.config.js
export const COLORS = {
  // Primary brand color (gold/yellow)
  brand: {
    main: '#e1b23c',      // brand-500
    hover: '#c99c33',     // brand-600
    active: '#a9822a',    // brand-700
  },
  
  // Map layer bucket colors (demographic data visualization)
  bucket: {
    0: {
      normal: '#ef4444',      // Red - strong negative growth
      selected: '#ef4444',
    },
    1: {
      normal: '#fb923c',      // Orange - moderate negative/low positive growth
      selected: '#fb923c',
    },
    2: {
      normal: '#e1b23c',      // Brand gold - neutral
      selected: '#e1b23c',
    },
    3: {
      normal: '#86efac',      // Light green - moderate positive growth
      selected: '#86efac',
    },
    4: {
      normal: '#22c55e',      // Dark green - strong positive growth
      selected: '#22c55e',
    },
  },
} as const;

// Layout constants
export const LAYOUT = {
  sidebarWidth: 300,        // Width of sidebar/legend in pixels
  containerWidth: '95%',    // Width of main containers
} as const;
