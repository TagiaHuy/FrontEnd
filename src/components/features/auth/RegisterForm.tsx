/*
 * RegisterForm - Form đăng ký tài khoản mới
 *
 * Chức năng:
 *   - Cho phép người dùng nhập thông tin để đăng ký tài khoản
 *   - Kiểm tra xác nhận mật khẩu, đồng ý điều khoản
 *   - Đánh giá độ mạnh mật khẩu
 *
 * Props:
 *   - onSubmit: Hàm xử lý khi submit form đăng ký
 *   - onLogin: Chuyển sang trang đăng nhập
 *   - loading: Trạng thái loading khi đăng ký
 *
 * Sử dụng:
 *   - Quản lý state form bằng useForm
 *   - Validate các trường, kiểm tra đồng ý điều khoản
 *   - Gọi onSubmit khi hợp lệ
 */
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Input } from '../../ui';
import { useForm, validationRules } from '../../../hooks';
import { colors, spacing, textStyles } from '../../../styles';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onLogin: () => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onLogin,
  loading = false,
}) => {
  const form = useForm<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  }, {
    name: validationRules.required,
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: validationRules.confirmPassword('password'),
  });

  const handleSubmit = async () => {
    console.log("call");
    if (!form.validateForm()) {
      return;
    }

    if (!form.values.acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    try {
      await onSubmit(form.values);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'Weak', color: colors.error.main };
    if (strength <= 3) return { level: 'Fair', color: colors.warning.main };
    if (strength <= 4) return { level: 'Good', color: colors.info.main };
    return { level: 'Strong', color: colors.success.main };
  };

  const passwordStrength = getPasswordStrength(form.values.password);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={form.values.name}
        onChangeText={form.handleChange('name')}
        onBlur={form.handleBlur('name')}
        error={form.touched.name ? form.errors.name : undefined}
        autoCapitalize="words"
        fullWidth
      />

      <Input
        label="Email"
        placeholder="Enter your email"
        value={form.values.email}
        onChangeText={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
        error={form.touched.email ? form.errors.email : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        fullWidth
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={form.values.password}
        onChangeText={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
        error={form.touched.password ? form.errors.password : undefined}
        secureTextEntry
        fullWidth
      />

      {form.values.password.length > 0 && (
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthLabel}>Password strength: </Text>
          <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
            {passwordStrength.level}
          </Text>
        </View>
      )}

      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        value={form.values.confirmPassword}
        onChangeText={form.handleChange('confirmPassword')}
        onBlur={form.handleBlur('confirmPassword')}
        error={form.touched.confirmPassword ? form.errors.confirmPassword : undefined}
        secureTextEntry
        fullWidth
      />

      {form.values.confirmPassword.length > 0 && 
       form.values.password !== form.values.confirmPassword && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}

      <View style={styles.termsContainer}>
        <Button
          title="I agree to the Terms and Conditions"
          variant="ghost"
          size="small"
          onPress={() => form.setValue('acceptTerms', !form.values.acceptTerms)}
          icon={form.values.acceptTerms ? '✓' : undefined}
          iconPosition="left"
          style={styles.termsButton}
        />
      </View>

      <Button
        title={loading ? 'Creating Account...' : 'Create Account'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        style={styles.registerButton}
      />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Button
          title="Login"
          variant="ghost"
          onPress={onLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.lg,
  },
  
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  
  strengthLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  
  strengthText: {
    ...textStyles.caption,
    fontWeight: '600',
  },
  
  errorText: {
    ...textStyles.caption,
    color: colors.error.main,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  
  termsContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  
  termsButton: {
    paddingHorizontal: 0,
  },
  
  registerButton: {
    marginBottom: spacing.lg,
  },
  
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loginText: {
    ...textStyles.body2,
    color: colors.text.secondary,
  },
});

export default RegisterForm; 