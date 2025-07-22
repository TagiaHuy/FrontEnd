// Loading.tsx - Component hiển thị trạng thái loading với spinner và tuỳ chọn text, fullScreen
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, textStyles, spacing } from '../../../styles';

// Định nghĩa các props cho Loading
export interface LoadingProps {
  size?: 'small' | 'large'; // Kích thước spinner
  color?: string;           // Màu spinner
  text?: string;            // Text hiển thị dưới spinner
  fullScreen?: boolean;     // Hiển thị full màn hình hay không
  style?: any;              // Custom style cho container
  textStyle?: any;          // Custom style cho text
}

// Component Loading
const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = colors.primary.main,
  text,
  fullScreen = false,
  style,
  textStyle,
}) => {
  // Tạo style cho container, nếu fullScreen thì chiếm toàn bộ màn hình
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  // Style cho text loading, có thể custom thêm từ props
  const loadingTextStyle = [
    { fontSize: 16, color: 'black', fontWeight: 'bold' },
    textStyle,
  ];

  return (
    <View style={containerStyle}>
      {/* Spinner loading */}
      <ActivityIndicator size={size} color={color} />
      {/* Hiển thị text nếu có */}
      {text && (
        <Text style={loadingTextStyle}>
          {text}
        </Text>
      )}
    </View>
  );
};

// StyleSheet cho Loading
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