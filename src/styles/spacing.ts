// Spacing system for the application
export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
} as const;

// Margins
export const margins = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// Paddings
export const paddings = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// Gaps
export const gaps = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  '2xl': spacing['2xl'],
  '3xl': spacing['3xl'],
  '4xl': spacing['4xl'],
  '5xl': spacing['5xl'],
  '6xl': spacing['6xl'],
  '7xl': spacing['7xl'],
  '8xl': spacing['8xl'],
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Border width
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

// Shadow offsets
export const shadowOffset = {
  sm: { width: 0, height: 1 },
  md: { width: 0, height: 2 },
  lg: { width: 0, height: 4 },
  xl: { width: 0, height: 8 },
} as const;

// Shadow radius
export const shadowRadius = {
  sm: 2,
  md: 3.84,
  lg: 8,
  xl: 16,
} as const;

export type SpacingSize = keyof typeof spacing;
export type MarginSize = keyof typeof margins;
export type PaddingSize = keyof typeof paddings;
export type GapSize = keyof typeof gaps;
export type BorderRadiusSize = keyof typeof borderRadius;
export type BorderWidthSize = keyof typeof borderWidth;
export type ShadowSize = keyof typeof shadowOffset; 