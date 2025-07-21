import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius, borderWidth } from '../../../styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: any;
  textStyle?: any;
}

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
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyleArray = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary.main : colors.primary.contrast} 
        />
      ) : (
        <>
          {typeof icon === 'string' && iconPosition === 'left' && (
            <Text style={textStyleArray}>{icon}</Text>
          )}
          <Text style={textStyleArray}>{title}</Text>
          {typeof icon === 'string' && iconPosition === 'right' && (
            <Text style={textStyleArray}>{icon}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: borderWidth.thin,
    borderColor: 'transparent',
  },
  
  // Variants
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
  
  // Sizes
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
  
  // States
  disabled: {
    backgroundColor: colors.neutral.gray300,
    borderColor: colors.neutral.gray300,
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    ...textStyles.button,
    textAlign: 'center',
  },
  
  // Variant text colors
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
  
  // Size text styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Disabled text
  disabledText: {
    color: colors.neutral.gray500,
  },
});

export default Button; 