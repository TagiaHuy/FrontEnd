// Typography system for the application
export const typography = {
  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },
  
  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// Predefined text styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
  },
  h5: {
    fontSize: 16,
    fontWeight: '500',
  },
  h6: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Body text
  body1: {
    fontSize: 16,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
  },
  body3: {
    fontSize: 12,
    fontWeight: '400',
  },
  
  // Caption
  caption: {
    fontSize: 10,
    fontWeight: '400',
  },
  
  // Button text
  button: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Input text
  input: {
    fontSize: 16,
    fontWeight: '400',
  },
  
  // Label text
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
} as const;

export type TypographySize = keyof typeof typography.sizes;
export type TypographyWeight = keyof typeof typography.weights;
export type TextStyle = keyof typeof textStyles; 