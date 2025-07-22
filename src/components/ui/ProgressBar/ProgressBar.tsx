// ProgressBar.tsx - Component hiển thị thanh tiến trình với nhiều biến thể màu sắc, kích thước, vị trí label
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius } from '../../../styles';

// Định nghĩa các props cho ProgressBar
export interface ProgressBarProps {
  progress: number; // Giá trị tiến trình (0-100)
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'; // Kiểu màu sắc
  size?: 'small' | 'medium' | 'large'; // Kích thước thanh
  showLabel?: boolean; // Hiển thị label phần trăm hay không
  labelPosition?: 'top' | 'bottom' | 'inside'; // Vị trí label
  animated?: boolean; // Có animate không (chưa hỗ trợ)
  style?: any; // Custom style cho container
  labelStyle?: any; // Custom style cho label
}

// Component ProgressBar
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  labelPosition = 'top',
  animated = false, // Hiện tại chưa hỗ trợ animated
  style,
  labelStyle,
}) => {
  // Clamp progress giữa 0 và 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Style cho container ngoài
  const containerStyle = [
    styles.container,
    styles[size],
    style,
  ];

  // Style cho thanh nền progress
  const progressBarStyle = [
    styles.progressBar,
    styles[`${size}Bar`],
  ];

  // Style cho phần fill tiến trình
  const progressFillStyle = [
    styles.progressFill,
    styles[variant],
    { width: `${clampedProgress}%` as any },
  ];

  // Style cho label phần trăm
  const labelTextStyle = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    labelStyle,
  ];

  // Hàm render label phần trăm (ngoài thanh)
  const renderLabel = () => {
    if (!showLabel) return null;
    return (
      <Text style={labelTextStyle}>
        {Math.round(clampedProgress)}%
      </Text>
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Hiển thị label phía trên nếu chọn */}
      {labelPosition === 'top' && renderLabel()}
      
      <View style={containerStyle}>
        <View style={progressBarStyle}>
          {/* Phần fill tiến trình */}
          <View style={progressFillStyle} />
          {/* Hiển thị label bên trong thanh nếu chọn */}
          {labelPosition === 'inside' && showLabel && (
            <Text style={[styles.insideLabel, labelStyle]}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      </View>
      
      {/* Hiển thị label phía dưới nếu chọn */}
      {labelPosition === 'bottom' && renderLabel()}
    </View>
  );
};

// StyleSheet cho ProgressBar
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  
  container: {
    width: '100%',
  },
  
  // Các kích thước
  small: {
    marginVertical: spacing.xs,
  },
  medium: {
    marginVertical: spacing.sm,
  },
  large: {
    marginVertical: spacing.md,
  },
  
  // Thanh nền progress
  progressBar: {
    width: '100%',
    backgroundColor: colors.neutral.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  
  smallBar: {
    height: 4,
  },
  mediumBar: {
    height: 6,
  },
  largeBar: {
    height: 8,
  },
  
  // Phần fill tiến trình
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  // Các biến thể màu sắc
  primary: {
    backgroundColor: colors.primary.main,
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
  
  // Style cho label
  label: {
    ...textStyles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  topLabel: {
    marginBottom: spacing.xs,
  },
  bottomLabel: {
    marginTop: spacing.xs,
  },
  insideLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default ProgressBar; 