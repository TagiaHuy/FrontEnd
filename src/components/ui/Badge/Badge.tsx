// Badge.tsx - Badge component hiển thị nhãn nhỏ với nhiều biến thể màu sắc và kích thước
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius } from '../../../styles';

// Định nghĩa các props cho Badge
export interface BadgeProps {
  label: string; // Nội dung hiển thị trên badge
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'; // Kiểu màu sắc
  size?: 'small' | 'medium' | 'large'; // Kích thước badge
  children?: React.ReactNode; // Có thể truyền icon hoặc component khác vào badge
  style?: any; // Custom style cho View
  textStyle?: any; // Custom style cho Text
}

// Component Badge
const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  children,
  style,
  textStyle,
}) => {
  // Tạo style cho badge dựa trên variant và size
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[size],
    style,
  ];

  // Tạo style cho text, có thể custom thêm từ props
  const textStyleArray = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      {/* Nếu có children (ví dụ icon) thì render trước label */}
      {children}
      <Text style={textStyleArray}>{label}</Text>
    </View>
  );
};

// StyleSheet cho Badge
const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  
  // Các biến thể màu sắc
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
  
  // Các kích thước
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
  
  // Style cho text (không dùng trực tiếp, để tham khảo)
  text: {
    ...textStyles.caption,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Màu chữ cho từng biến thể (không dùng trực tiếp, để tham khảo)
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
  
  // Kích thước chữ cho từng size (không dùng trực tiếp, để tham khảo)
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