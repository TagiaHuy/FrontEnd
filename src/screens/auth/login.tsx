import React, { useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { API_BASE_URL, API_TIMEOUT } from '@env';
import { useAuth } from '../../context/AuthContext';
import { LoginForm, LoginFormData } from '../../components/features';
import { useApi } from '../../hooks';
import { commonStyles } from '../../styles';

const Login = ({ navigation }) => {
  const { login } = useAuth();
  const { execute, isLoading } = useApi<{ user: any; token: string }>();

  useEffect(() => {
    // Console log environment variables from .env file
    console.log('=== Environment Variables from .env ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('API_TIMEOUT:', API_TIMEOUT);
    console.log('=====================================');
  }, []);

  const handleLogin = async (formData: LoginFormData) => {
    const result = await execute(async () => {
      console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
      
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

      const data = await response.json();
      
      console.log('Login response:', data);

      if (response.ok) {
        // Store authentication data
        await login(data.user, data.token);
        
        // Login successful - navigation will be handled by AuthContext
        Alert.alert('Success', 'Login successful!');
        console.log('Login successful, user data:', data);
        return data;
      } else {
        // Login failed
        throw new Error(data.message || 'Login failed. Please try again.');
      }
    });

    if (result.success) {
      // Navigation will be handled by AuthContext
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log('Social login:', provider);
    Alert.alert('Coming Soon', `${provider} login will be implemented soon.`);
  };

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