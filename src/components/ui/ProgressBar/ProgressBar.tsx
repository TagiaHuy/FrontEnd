import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles, spacing, borderRadius } from '../../../styles';

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
  animated?: boolean;
  style?: any;
  labelStyle?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  labelPosition = 'top',
  animated = false,
  style,
  labelStyle,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const containerStyle = [
    styles.container,
    styles[size],
    style,
  ];

  const progressBarStyle = [
    styles.progressBar,
    styles[`${size}Bar`],
  ];

  const progressFillStyle = [
    styles.progressFill,
    styles[variant],
    { width: `${clampedProgress}%` as any },
  ];

  const labelTextStyle = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    labelStyle,
  ];

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
      {labelPosition === 'top' && renderLabel()}
      
      <View style={containerStyle}>
        <View style={progressBarStyle}>
          <View style={progressFillStyle} />
          {labelPosition === 'inside' && showLabel && (
            <Text style={[styles.insideLabel, labelStyle]}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      </View>
      
      {labelPosition === 'bottom' && renderLabel()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  
  container: {
    width: '100%',
  },
  
  // Sizes
  small: {
    marginVertical: spacing.xs,
  },
  medium: {
    marginVertical: spacing.sm,
  },
  large: {
    marginVertical: spacing.md,
  },
  
  // Progress bar
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
  
  // Progress fill
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  // Variants
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
  
  // Labels
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