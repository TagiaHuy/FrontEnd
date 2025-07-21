import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing, borderRadius, borderWidth, shadowOffset, shadowRadius } from './spacing';
import { textStyles } from './typography';

// Common styles used throughout the application
export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background.primary,
  },
  
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Cards
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow.medium,
    shadowOffset: shadowOffset.md,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.md,
    elevation: 5,
  },
  
  cardLight: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.shadow.light,
    shadowOffset: shadowOffset.sm,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.sm,
    elevation: 2,
  },
  
  // Buttons
  button: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: borderWidth.thin,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonDisabled: {
    backgroundColor: colors.neutral.gray300,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Inputs
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  inputFocused: {
    backgroundColor: colors.background.primary,
    borderWidth: borderWidth.medium,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  inputError: {
    backgroundColor: colors.background.primary,
    borderWidth: borderWidth.medium,
    borderColor: colors.error.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textStyles.input,
    color: colors.text.primary,
  },
  
  // Labels
  label: {
    ...textStyles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  // Badges
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Progress bars
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  
  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  
  // Shadows
  shadowLight: {
    shadowColor: colors.shadow.light,
    shadowOffset: shadowOffset.sm,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.sm,
    elevation: 2,
  },
  
  shadowMedium: {
    shadowColor: colors.shadow.medium,
    shadowOffset: shadowOffset.md,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.md,
    elevation: 5,
  },
  
  shadowHeavy: {
    shadowColor: colors.shadow.dark,
    shadowOffset: shadowOffset.lg,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.lg,
    elevation: 8,
  },
});

// Helper functions for dynamic styles
export const createShadow = (size: 'light' | 'medium' | 'heavy' = 'medium') => {
  const shadowConfigs = {
    light: {
      shadowColor: colors.shadow.light,
      shadowOffset: shadowOffset.sm,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.sm,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.shadow.medium,
      shadowOffset: shadowOffset.md,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.md,
      elevation: 5,
    },
    heavy: {
      shadowColor: colors.shadow.dark,
      shadowOffset: shadowOffset.lg,
      shadowOpacity: 1,
      shadowRadius: shadowRadius.lg,
      elevation: 8,
    },
  };
  
  return shadowConfigs[size];
};

export const createBorderRadius = (size: keyof typeof borderRadius = 'md') => {
  return { borderRadius: borderRadius[size] };
};

export const createPadding = (size: keyof typeof spacing = 'md') => {
  return { padding: spacing[size] };
};

export const createMargin = (size: keyof typeof spacing = 'md') => {
  return { margin: spacing[size] };
}; 