// Input.tsx - Input component với nhiều biến thể (outlined, filled), kích thước, trạng thái focus/error, hỗ trợ icon trái/phải
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, textStyles, spacing, borderRadius, borderWidth } from '../../../styles';

// Định nghĩa các props cho Input
export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string; // Nhãn hiển thị phía trên input
  error?: string; // Thông báo lỗi
  helperText?: string; // Text phụ trợ dưới input
  variant?: 'outlined' | 'filled'; // Kiểu input: viền hoặc nền đặc
  size?: 'small' | 'medium' | 'large'; // Kích thước input
  fullWidth?: boolean; // Input chiếm toàn bộ chiều ngang
  leftIcon?: React.ReactNode; // Icon bên trái
  rightIcon?: React.ReactNode; // Icon bên phải
  containerStyle?: any; // Custom style cho container
  inputStyle?: any; // Custom style cho TextInput
  labelStyle?: any; // Custom style cho label
  errorStyle?: any; // Custom style cho error text
  helperStyle?: any; // Custom style cho helper text
}

// Component Input
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  // State kiểm soát trạng thái focus
  const [isFocused, setIsFocused] = useState(false);

  // Xử lý khi focus vào input
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Xử lý khi blur khỏi input
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Style cho container của input (viền, nền, trạng thái, v.v.)
  const inputContainerStyle = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isFocused && styles.focused,
    error && styles.error,
    containerStyle,
  ];

  // Style cho chính TextInput
  const inputStyleArray = [
    styles.input,
    styles[`${variant}Input`],
    styles[`${size}Input`],
    inputStyle,
  ];

  return (
    <View style={styles.container}>
      {/* Label phía trên input */}
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      {/* Khối input + icon */}
      <View style={inputContainerStyle}>
        {/* Icon bên trái nếu có */}
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        {/* TextInput chính */}
        <TextInput
          style={inputStyleArray}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          {...textInputProps}
        />
        
        {/* Icon bên phải nếu có */}
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {/* Hiển thị error hoặc helperText */}
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText,
          helperStyle,
          errorStyle,
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// StyleSheet cho Input
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.thin,
    borderRadius: borderRadius.md,
  },
  
  // Biến thể hiển thị
  outlined: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.medium,
  },
  filled: {
    backgroundColor: colors.background.secondary,
    borderColor: 'transparent',
  },
  
  // Kích thước
  small: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  
  // Trạng thái
  focused: {
    borderColor: colors.primary.main,
    borderWidth: borderWidth.medium,
  },
  error: {
    borderColor: colors.error.main,
    borderWidth: borderWidth.medium,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Style cho TextInput
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  
  outlinedInput: {
    backgroundColor: 'transparent',
  },
  filledInput: {
    backgroundColor: 'transparent',
  },
  
  smallInput: {
    fontSize: 14,
  },
  mediumInput: {
    fontSize: 16,
  },
  largeInput: {
    fontSize: 18,
  },
  
  // Icon trái/phải
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  
  // Text phụ trợ/error
  helperText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error.main,
  },
});

export default Input; 