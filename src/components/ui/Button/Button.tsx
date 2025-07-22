// Button.tsx - Button component với nhiều biến thể, kích thước, trạng thái loading/disabled, hỗ trợ icon
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius, borderWidth } from '../../../styles';

// Định nghĩa các props cho Button
export interface ButtonProps {
  title: string; // Nội dung nút
  onPress: () => void; // Hàm xử lý khi bấm nút
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // Kiểu nút
  size?: 'small' | 'medium' | 'large'; // Kích thước
  disabled?: boolean; // Trạng thái disabled
  loading?: boolean; // Trạng thái loading
  fullWidth?: boolean; // Nút chiếm toàn bộ chiều ngang
  icon?: React.ReactNode; // Icon hoặc ký tự hiển thị kèm
  iconPosition?: 'left' | 'right'; // Vị trí icon
  style?: any; // Custom style cho nút
  textStyle?: any; // Custom style cho text
}

// Component Button
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  // Tạo style cho nút dựa trên variant, size, trạng thái
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  // Tạo style cho text, có thể custom thêm từ props
  const textStyleArray = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  // Xác định trạng thái disabled thực tế (disabled hoặc loading)
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {/* Hiển thị loading nếu đang loading, ngược lại hiển thị icon và title */}
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary.main : colors.primary.contrast} 
        />
      ) : (
        <>
          {/* Hiển thị icon bên trái nếu có và là string */}
          {typeof icon === 'string' && iconPosition === 'left' && (
            <Text style={textStyleArray}>{icon}</Text>
          )}
          {/* Hiển thị tiêu đề nút */}
          <Text style={textStyleArray}>{title}</Text>
          {/* Hiển thị icon bên phải nếu có và là string */}
          {typeof icon === 'string' && iconPosition === 'right' && (
            <Text style={textStyleArray}>{icon}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// StyleSheet cho Button
const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.thin,
    borderColor: 'transparent',
  },
  
  // Các biến thể màu sắc
  primary: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    borderColor: colors.secondary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.error.main,
    borderColor: colors.error.main,
  },
  
  // Các kích thước
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  
  // Trạng thái disabled
  disabled: {
    backgroundColor: colors.neutral.gray300,
    borderColor: colors.neutral.gray300,
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Style cho text (không dùng trực tiếp, để tham khảo)
  text: {
    ...textStyles.button,
    textAlign: 'center',
  },
  
  // Màu chữ cho từng biến thể (không dùng trực tiếp, để tham khảo)
  primaryText: {
    color: colors.primary.contrast,
  },
  secondaryText: {
    color: colors.secondary.contrast,
  },
  outlineText: {
    color: colors.primary.main,
  },
  ghostText: {
    color: colors.primary.main,
  },
  dangerText: {
    color: colors.error.contrast,
  },
  
  // Kích thước chữ cho từng size (không dùng trực tiếp, để tham khảo)
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Màu chữ khi disabled (không dùng trực tiếp, để tham khảo)
  disabledText: {
    color: colors.neutral.gray500,
  },
});

export default Button; 