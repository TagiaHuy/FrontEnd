// Register.tsx - Màn hình đăng ký tài khoản mới cho người dùng

import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import { useAuth } from '../../context/AuthContext';
import { RegisterForm, RegisterFormData } from '../../components/features';
import { useApi } from '../../hooks';
import { commonStyles } from '../../styles';

// Component chính cho màn hình Register
const Register = ({ navigation }) => {
  // Lấy hàm login từ AuthContext để tự động đăng nhập sau khi đăng ký thành công
  const { login } = useAuth();
  // Hook useApi để quản lý trạng thái gọi API
  const { execute, isLoading } = useApi<{ user: any; token: string }>();

  // Xử lý đăng ký khi submit form
  const handleRegister = async (formData: RegisterFormData) => {
    // Gọi API đăng ký thông qua hook useApi
    const result = await execute(async () => {
      // Log endpoint đang gọi
      console.log('Making register request to:', `${API_BASE_URL}/auth/register`);
      
      // Gửi request POST tới API đăng ký
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      // Parse response từ API
      const data = await response.json();
      
      // Log kết quả trả về từ API
      console.log('Register response:', data);

      if (response.ok) {
        // Kiểm tra nếu response trả về user và token (tức là auto-login)
        if (data.user && data.token) {
          // Đăng ký thành công và tự động đăng nhập
          await login(data.user, data.token);
          Alert.alert('Success', 'Registration successful! Welcome!');
          console.log('Registration successful with auto-login, user data:', data);
        } else {
          // Đăng ký thành công nhưng cần xác thực email
          Alert.alert(
            'Registration Successful!', 
            data.message || 'Please check your email to verify your account before logging in.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Điều hướng về màn hình đăng nhập
                  navigation.navigate('Login');
                }
              }
            ]
          );
          console.log('Registration successful, email verification required');
        }
        return data;
      } else {
        // Đăng ký thất bại, ném lỗi để useApi xử lý
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
    });

    if (result.success) {
      // Nếu đăng ký thành công, điều hướng sẽ được xử lý bởi AuthContext hoặc Alert callback
    }
  };

  // Xử lý khi bấm "Đăng nhập"
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Render UI màn hình đăng ký
  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      <RegisterForm
        onSubmit={handleRegister}
        onLogin={handleLogin}
        loading={isLoading}
      />
    </ScrollView>
  );
};

export default Register; 