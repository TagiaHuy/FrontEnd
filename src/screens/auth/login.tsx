// Login.tsx - Màn hình đăng nhập cho người dùng

import React, { useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { useAuth } from '../../context/AuthContext';
import { LoginForm, LoginFormData } from '../../components/features';
import { useApi } from '../../hooks';
import { commonStyles } from '../../styles';

// Component chính cho màn hình Login
const Login = ({ navigation }) => {
  // Lấy hàm login từ AuthContext
  const { login } = useAuth();
  // Hook useApi để quản lý trạng thái gọi API
  const { execute, isLoading } = useApi<{ user: any; token: string }>();

  useEffect(() => {
    // Log các biến môi trường từ file .env để debug
    console.log('=== Environment Variables from .env ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);
    console.log('=====================================');
  }, []);

  // Xử lý đăng nhập khi submit form
  const handleLogin = async (formData: LoginFormData) => {
    // Gọi API đăng nhập thông qua hook useApi
    const result = await execute(async () => {
      // Log endpoint đang gọi
      console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
      
      // Gửi request POST tới API đăng nhập
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      // Parse response từ API
      const data = await response.json();
      
      // Log kết quả trả về từ API
      console.log('Login response:', data);

      if (response.ok) {
        // Lưu thông tin xác thực vào context
        await login(data.user, data.token);
        
        // Đăng nhập thành công - điều hướng sẽ được xử lý bởi AuthContext
        Alert.alert('Success', 'Login successful!');
        console.log('Login successful, user data:', data);
        return data;
      } else {
        // Đăng nhập thất bại, ném lỗi để useApi xử lý
        throw new Error(data.message || 'Login failed. Please try again.');
      }
    });

    if (result.success) {
      // Nếu đăng nhập thành công, điều hướng sẽ được xử lý bởi AuthContext
    }
  };

  // Xử lý khi bấm "Quên mật khẩu"
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Xử lý khi bấm "Đăng ký"
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  // Xử lý đăng nhập mạng xã hội (chưa implement)
  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log('Social login:', provider);
    Alert.alert('Coming Soon', `${provider} login will be implemented soon.`);
  };

  // Render UI màn hình đăng nhập
  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
        onSocialLogin={handleSocialLogin}
        loading={isLoading}
      />
    </ScrollView>
  );
};

export default Login; 