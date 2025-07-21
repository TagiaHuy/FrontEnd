import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, textStyles, spacing } from '../../../styles';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: any;
  textStyle?: any;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = colors.primary.main,
  text,
  fullScreen = false,
  style,
  textStyle,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  const loadingTextStyle = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={loadingTextStyle}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  text: {
    ...textStyles.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default Loading; 