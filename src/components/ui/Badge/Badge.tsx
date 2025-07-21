import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius } from '../../../styles';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  style?: any;
  textStyle?: any;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  children,
  style,
  textStyle,
}) => {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[size],
    style,
  ];

  const textStyleArray = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      {children}
      <Text style={textStyleArray}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
  },
  success: {
    backgroundColor: colors.success.main,
  },
  warning: {
    backgroundColor: colors.warning.main,
  },
  error: {
    backgroundColor: colors.error.main,
  },
  info: {
    backgroundColor: colors.info.main,
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minHeight: 16,
  },
  medium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 20,
  },
  large: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 24,
  },
  
  // Text styles
  text: {
    ...textStyles.caption,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Variant text colors
  primaryText: {
    color: colors.primary.contrast,
  },
  secondaryText: {
    color: colors.secondary.contrast,
  },
  successText: {
    color: colors.success.contrast,
  },
  warningText: {
    color: colors.warning.contrast,
  },
  errorText: {
    color: colors.error.contrast,
  },
  infoText: {
    color: colors.info.contrast,
  },
  
  // Size text styles
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});

export default Badge; 