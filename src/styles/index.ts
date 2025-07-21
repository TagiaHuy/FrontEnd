// Export all styles from a single entry point
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './common';

// Re-export commonly used items for convenience
export { colors, priorityColors, statusColors } from './colors';
export { typography, textStyles } from './typography';
export { spacing, margins, paddings, gaps, borderRadius, borderWidth } from './spacing';
export { commonStyles, createShadow, createBorderRadius, createPadding, createMargin } from './common'; 