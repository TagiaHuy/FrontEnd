import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router'; 
import {API_URL} from '@env';
import axios from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        // Lưu token vào AsyncStorage hoặc state management
        // TODO: Implement token storage
        router.replace('/');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }]}
    >
      <ThemedView style={styles.formContainer}>
        <ThemedText style={styles.title}>Đăng Nhập</ThemedText>
        
        <TextInput
          style={[styles.input, { color: textColor, borderColor: primaryColor }]}
          placeholder="Email"
          placeholderTextColor={textColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { color: textColor, borderColor: primaryColor }]}
          placeholder="Mật khẩu"
          placeholderTextColor={textColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={handleLogin}
        >
          <ThemedText style={styles.buttonText}>Đăng Nhập</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => router.replace('/register')}
        >
          <ThemedText style={styles.registerLinkText}>
            Chưa có tài khoản? Đăng ký
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 