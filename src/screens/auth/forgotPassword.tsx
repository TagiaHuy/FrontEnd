// ForgotPassword.tsx - Màn hình quên mật khẩu, gửi link reset qua email

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { API_BASE_URL } from '@env';
import { textStyles, colors, spacing } from '../../styles';

// Component chính cho màn hình Forgot Password
const ForgotPassword = ({ navigation }) => {
  // State lưu email người dùng nhập
  const [email, setEmail] = useState('');
  // State kiểm soát trạng thái loading khi gửi request
  const [isLoading, setIsLoading] = useState(false);
  // State hiển thị thông báo thành công
  const [isSuccess, setIsSuccess] = useState(false);

  // Hàm kiểm tra định dạng email hợp lệ
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Xử lý gửi yêu cầu reset password
  const handleSendResetLink = async () => {
    // Kiểm tra email rỗng
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Gửi request POST tới API reset password
      console.log('Making reset password request to:', `${API_BASE_URL}/auth/request-reset`);
      
      const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();
      
      console.log('Reset password response:', data);

      if (response.ok) {
        // Thành công - hiển thị thông báo và chuyển về màn hình đăng nhập
        setIsSuccess(true);
        Alert.alert(
          'Reset Link Sent!', 
          data.message || 'Please check your email for password reset instructions.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Quay lại màn hình đăng nhập
                navigation.navigate('Login');
              }
            }
          ]
        );
        console.log('Reset link sent successfully');
      } else {
        // Lỗi từ server
        Alert.alert('Error', data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      // Lỗi mạng hoặc exception
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý quay lại màn hình đăng nhập
  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Tiêu đề màn hình */}
        <Text style={styles.title}>Forgot Password</Text>
        {/* Mô tả hướng dẫn */}
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        {/* Nút gửi link reset */}
        <TouchableOpacity 
          style={[styles.resetButton, isLoading && styles.disabledButton]} 
          onPress={handleSendResetLink}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        {/* Thông báo thành công */}
        {isSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              ✓ Reset link has been sent to your email
            </Text>
          </View>
        )}

        {/* Link quay lại đăng nhập */}
        <TouchableOpacity style={styles.backLink} onPress={handleBackToLogin}>
          <Text style={styles.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// StyleSheet cho ForgotPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing['3xl'],
  },
  label: {
    ...textStyles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    backgroundColor: colors.background.secondary,
  },
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  disabledButton: {
    backgroundColor: colors.neutral.gray300,
  },
  resetButtonText: {
    ...textStyles.button,
    color: colors.primary.contrast,
  },
  successContainer: {
    backgroundColor: colors.success.light,
    borderColor: colors.success.main,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing['3xl'],
    width: '100%',
  },
  successText: {
    ...textStyles.body2,
    color: colors.success.dark,
    textAlign: 'center',
    fontWeight: '500',
  },
  backLink: {
    paddingVertical: spacing.md,
  },
  backLinkText: {
    ...textStyles.body2,
    color: colors.primary.main,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword; 