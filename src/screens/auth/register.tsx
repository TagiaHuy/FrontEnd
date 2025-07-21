import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { API_BASE_URL } from '@env';
import { useAuth } from '../../context/AuthContext';
import { RegisterForm, RegisterFormData } from '../../components/features';
import { useApi } from '../../hooks';
import { commonStyles } from '../../styles';

const Register = ({ navigation }) => {
  const { login } = useAuth();
  const { execute, isLoading } = useApi<{ user: any; token: string }>();

  const handleRegister = async (formData: RegisterFormData) => {
    const result = await execute(async () => {
      console.log('Making register request to:', `${API_BASE_URL}/auth/register`);
      
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

      const data = await response.json();
      
      console.log('Register response:', data);

      if (response.ok) {
        // Check if the response includes user data and token (auto-login)
        if (data.user && data.token) {
          // Registration successful with auto-login
          await login(data.user, data.token);
          Alert.alert('Success', 'Registration successful! Welcome!');
          console.log('Registration successful with auto-login, user data:', data);
        } else {
          // Registration successful but requires email verification
          Alert.alert(
            'Registration Successful!', 
            data.message || 'Please check your email to verify your account before logging in.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate back to login screen
                  navigation.navigate('Login');
                }
              }
            ]
          );
          console.log('Registration successful, email verification required');
        }
        return data;
      } else {
        // Registration failed
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
    });

    if (result.success) {
      // Navigation will be handled by AuthContext or Alert callback
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

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