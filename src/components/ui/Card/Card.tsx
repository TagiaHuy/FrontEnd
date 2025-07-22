// Card.tsx - Card component hiển thị khối nội dung với nhiều biến thể (elevated, outlined, filled) và tuỳ chọn padding
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, spacing, borderRadius, shadowOffset, shadowRadius } from '../../../styles';

// Định nghĩa các props cho Card
export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled'; // Kiểu hiển thị: nổi bóng, viền, nền đặc
  padding?: 'none' | 'small' | 'medium' | 'large'; // Độ lớn padding
  children: React.ReactNode; // Nội dung bên trong Card
}

// Component Card
const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  children,
  style,
  ...props
}) => {
  // Tạo style cho Card dựa trên variant và padding
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

// StyleSheet cho Card
const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
  },
  
  // Các biến thể hiển thị
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
  
  // Các biến thể padding
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