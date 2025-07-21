import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, textStyles, spacing, borderRadius, borderWidth } from '../../../styles';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
  helperStyle?: any;
}

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
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isFocused && styles.focused,
    error && styles.error,
    containerStyle,
  ];

  const inputStyleArray = [
    styles.input,
    styles[`${variant}Input`],
    styles[`${size}Input`],
    inputStyle,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={inputStyleArray}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
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
  
  // Variants
  outlined: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.medium,
  },
  filled: {
    backgroundColor: colors.background.secondary,
    borderColor: 'transparent',
  },
  
  // Sizes
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
  
  // States
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
  
  // Input styles
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
  
  // Icons
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  
  // Helper text
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