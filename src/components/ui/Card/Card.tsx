import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, spacing, borderRadius, shadowOffset, shadowRadius } from '../../../styles';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  children,
  style,
  ...props
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
  },
  
  // Variants
  elevated: {
    shadowColor: colors.shadow.medium,
    shadowOffset: shadowOffset.md,
    shadowOpacity: 1,
    shadowRadius: shadowRadius.md,
    elevation: 5,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  filled: {
    backgroundColor: colors.background.secondary,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingMedium: {
    padding: spacing.md,
  },
  paddingLarge: {
    padding: spacing.lg,
  },
});

export default Card; 