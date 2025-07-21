// Color palette for the entire application
export const colors = {
  // Primary colors
  primary: {
    main: '#007AFF',
    light: '#4DA3FF',
    dark: '#0056CC',
    contrast: '#FFFFFF',
  },
  
  // Secondary colors
  secondary: {
    main: '#6C757D',
    light: '#ADB5BD',
    dark: '#495057',
    contrast: '#FFFFFF',
  },
  
  // Success colors
  success: {
    main: '#28A745',
    light: '#5CB85C',
    dark: '#1E7E34',
    contrast: '#FFFFFF',
  },
  
  // Warning colors
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FF8F00',
    contrast: '#212529',
  },
  
  // Error colors
  error: {
    main: '#DC3545',
    light: '#E57373',
    dark: '#C62828',
    contrast: '#FFFFFF',
  },
  
  // Info colors
  info: {
    main: '#17A2B8',
    light: '#4FC3F7',
    dark: '#0277BD',
    contrast: '#FFFFFF',
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#000000',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E9ECEF',
  },
  
  // Text colors
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    tertiary: '#ADB5BD',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: {
    light: '#E9ECEF',
    medium: '#DEE2E6',
    dark: '#CED4DA',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

// Priority colors mapping
export const priorityColors = {
  high: colors.error.main,
  medium: colors.warning.main,
  low: colors.success.main,
} as const;

// Status colors mapping
export const statusColors = {
  completed: colors.success.main,
  in_progress: colors.primary.main,
  not_started: colors.secondary.main,
} as const;

export type ColorKey = keyof typeof colors;
export type PriorityLevel = keyof typeof priorityColors;
export type StatusType = keyof typeof statusColors; 